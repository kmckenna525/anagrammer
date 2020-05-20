import { RawExpression, TokenType } from "./RawExpression";

const END_WORD = 'END';

export class WordNode {
    value:string;
    children:Map<string, WordNode>;

    constructor(val: string) {
        this.value = val;
        this.children = new Map<string, WordNode>();
    }

    hasChild(letter:string): boolean {
        return this.children.has(letter);
    }

    getChild(letter:string): WordNode {
        const child = this.children.get(letter);
        if(!child) {
            throw new RangeError('key not found');
        }
        return child;
    }

    tryGetChildAtPath(path:string): WordNode | null {
        let currentNode:WordNode = this;
        for (const letter of path.split('')) {
            if(!currentNode.hasChild(letter)) {
                return null;
            }
            currentNode = currentNode.getChild(letter);
        }
        return currentNode;
    }

    addChild(letter:string): WordNode { 
        if(this.hasChild(letter)) {
            return this.getChild(letter);;
        }
        
        const child = new WordNode(letter);
        this.children.set(letter, child);
        return child;
    }

    isWord():boolean {
        return this.hasChild(END_WORD);
    }

    getWords(prefix:string):string[] {
        const words:string[] = [];

        this.getWordsInternal(prefix, words);

        return words;
    }

    private getWordsInternal(prefix: string, words: string[]) {
        if(this.value === END_WORD) {
            console.log(prefix);
            words.push(prefix);
        }

        this.children.forEach((child)=>{
            child.getWordsInternal(prefix + this.value, words);
        })
    }
}

// partial trie for processing these wordsss
export class WordTrie {
    private head:WordNode;

    constructor() {
        this.head = new WordNode('');
    }

    isWord(word:string): boolean { 
        let currentNode:WordNode = this.head;
        for (const letter of word.split('')) {
            if(!currentNode.hasChild(letter)) {
                return false;
            }

            currentNode = currentNode.getChild(letter);
        }
        
        return currentNode.hasChild(END_WORD);
    }

    addWord(word:string) {
        let currentNode = this.head;
        for (const letter of word.split('')) {
            currentNode = currentNode.addChild(letter);
        }

        currentNode.addChild(END_WORD);
    }
    
    hasNodeWithPrefix(prefix:string):boolean {
        let currentNode = this.head;
        for (const letter of prefix.split('')) {
            if(!currentNode.hasChild(letter)) {
                return false;
            }
            currentNode = currentNode.getChild(letter);
        }
        return true;
    }
    
    getNodeWithPrefix(prefix:string):WordNode | null {
        let currentNode = this.head;
        for (const letter of prefix.split('')) {
            if(!currentNode.hasChild(letter)) {
                return null;
            }
            currentNode = currentNode.getChild(letter);
        }
        return currentNode;
    }
    
    getWordsWithPattern(pattern:string):string[] {
        const expression = new RawExpression(pattern);

        let currentNodes:SearchNode[] = [new SearchNode(this.head)];
        let nextNodes:SearchNode[] = [];
        for (const token of expression.tokens) {
            console.log(token);
            for (const searchNode of currentNodes) {
                switch (token.type) {
                    case TokenType.Letter:
                        if(token.data && searchNode.node.hasChild(token.data)){
                            nextNodes.push(new SearchNode(
                                searchNode.node.getChild(token.data),
                                searchNode.path + token.data
                            ));
                        }
                        break;
                    case TokenType.Any:
                        // eslint-disable-next-line no-loop-func
                        searchNode.node.children.forEach((subnode)=> {
                            nextNodes.push(new SearchNode(
                                subnode,
                                searchNode.path + subnode.value
                            ));
                        });
                        break;
                    case TokenType.Group:
                        if(token.arrayData){
                            for (const letter of token.arrayData) {
                                if(searchNode.node.hasChild(letter)){
                                    nextNodes.push(new SearchNode(
                                        searchNode.node.getChild(letter),
                                        searchNode.path + letter
                                    ));
                                }
                            }
                        }
                        break;
                
                    default:
                        break;
                }
            }
            currentNodes.forEach(function(searchNode){
            })
            console.log(nextNodes.length);
            currentNodes = nextNodes;
            nextNodes = [];
        }

        const words:string[] = [];
        for (const node of currentNodes) {
            if(node.node.hasChild(END_WORD)){
                words.push(node.path);
            }
        }
        return words;
    }
    
    getAnagrams(query:string):string[] {
        const pool = new AnagramPool(query);
        const words:string[] = [];
        this.getAnagramsInternal(pool, new SearchNode(this.head), words);
        words.sort((a,b)=>b.length - a.length);
        return words;
    }
    
    private getAnagramsInternal(pool:AnagramPool, searchNode:SearchNode, words:string[]) {
        const remaining = pool.getIterableRemaining();
        console.log(searchNode.path);

        if(pool.count === 0) {
            return;
        }

        for (const letter of remaining) {
            console.log(letter);
            // is this letter even a valid path?
            if(!searchNode.node.hasChild(letter)) {
                continue;
            }

            const nextNode = new SearchNode (
                searchNode.node.getChild(letter),
                searchNode.path + letter
            );

            // is this child node a word?
            if(nextNode.node.isWord()) {
                words.push(nextNode.path);
            }

            pool.use(letter);
            this.getAnagramsInternal(pool, nextNode, words)
            pool.restore(letter);
        }
    }
    
    getNAnagrams(query:string):string[] {
        const pool = new NAnagramPool(query);
        const words:string[] = [];
        this.getNAnagramsInternal(pool, new SearchNode(this.head), 0, words);
        words.sort((a,b)=>b.length - a.length);
        return words;
    }
    
    private getNAnagramsInternal(pool:NAnagramPool, searchNode:SearchNode, depth:number, words:string[]) {
        const remaining = pool.getIterableRemaining();
        console.log(searchNode.path);

        if(pool.count === 0) {
            return;
        }

        for (const ngram of remaining) {
            // is this letter even a valid path?
            const nextNode = searchNode.node.tryGetChildAtPath(ngram);
            if(!nextNode) {
                continue;
            }

            const nextSearchNode = new SearchNode (
                nextNode,
                searchNode.path + ngram
            );

            // is this child node a word?
            if(nextNode.isWord() && !words.includes(nextSearchNode.path)) {
                words.push(nextSearchNode.path);
            }

            pool.use(ngram);
            this.getNAnagramsInternal(pool, nextSearchNode, depth + 1, words)

            //check the substrings
            if(depth === 0) {
                // check the first subgrams
                for (let start = 1; start < ngram.length; start++) {
                    const subgram = ngram.substring(start);
                    const nextNode = searchNode.node.tryGetChildAtPath(subgram);
                    if(!nextNode) {
                        continue;
                    }
        
                    const nextSearchNode = new SearchNode (
                        nextNode,
                        searchNode.path + subgram
                    );
        
                    // is this child node a word?
                    if(nextNode.isWord() && !words.includes(nextSearchNode.path)) {
                        words.push(nextSearchNode.path);
                    }
                    this.getNAnagramsInternal(pool, nextSearchNode, depth + 1, words)
                }
            }
            else
            {
                // check the latter subgrams
                for (let start = 1; start < ngram.length; start++) {
                    const subgram = ngram.substring(0, ngram.length - start - 1);
                    const nextNode = searchNode.node.tryGetChildAtPath(subgram);
                    if(!nextNode) {
                        continue;
                    }
        
                    const nextSearchNode = new SearchNode (
                        nextNode,
                        searchNode.path + subgram
                    );
        
                    // is this child node a word?
                    if(nextNode.isWord() && !words.includes(nextSearchNode.path)) {
                        words.push(nextSearchNode.path);
                    }
                }
            }
            pool.restore(ngram);
        }
    }
} 

class AnagramPool {
    map: Map<string, number>;
    count: number;
    readonly all: string[];

    constructor(query:string) {
        this.map = new Map<string, number>();
        this.all = query.split('');
        this.count = query.length;
        for (const letter of this.all) {
            this.map.set(letter, (this.map.get(letter) ?? 0) + 1);
        }
    }

    getIterableRemaining(): string[] {
        const remaining:string[] = [];
        this.map.forEach((value, key) => {
            if(value > 0) {
                remaining.push(key);
            }
        })
        return remaining;
    }

    use(letter:string): boolean {
        if(!this.map.has(letter) || (this.map.get(letter) ?? 0) <= 0) {
            return false;
        }

        this.map.set(letter, (this.map.get(letter) ?? 0) - 1);
        this.count--;
        return true;
    }

    restore(letter:string) {
        if(!this.map.has(letter)) {
            throw Error('trying to add letter that was never there');
        }

        this.map.set(letter, (this.map.get(letter) ?? 0) + 1);
        this.count++;
    }
}

class NAnagramPool {
    map: Map<string, number>;
    count: number;

    constructor(query:string) {
        this.map = new Map<string, number>();
        this.count = query.length;

        const all = query.split(' ');
        for (const ngram of all) {
            
            this.map.set(ngram, (this.map.get(ngram) ?? 0) + 1);
        }
    }

    getIterableRemaining(): string[] {
        const remaining:string[] = [];
        this.map.forEach((value, key) => {
            if(value > 0) {
                remaining.push(key);
            }
        })
        return remaining;
    }

    use(ngram:string): boolean {
        if(!this.map.has(ngram) || (this.map.get(ngram) ?? 0) <= 0) {
            return false;
        }

        this.map.set(ngram, (this.map.get(ngram) ?? 0) - 1);
        this.count--;
        return true;
    }

    restore(ngram:string) {
        if(!this.map.has(ngram)) {
            throw Error('trying to add letter that was never there');
        }

        this.map.set(ngram, (this.map.get(ngram) ?? 0) + 1);
        this.count++;
    }
}

class SearchNode {
    node:WordNode;
    path:string;
    
    constructor(node:WordNode, path?:string) {
        this.node = node;
        this.path = path ?? '';
    }
}