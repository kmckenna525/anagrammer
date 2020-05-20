import words from '../data/words_dictionary.json'
import { WordTrie } from './wordTrie'
import {observable} from 'mobx'

export class QueryDriver {
    query:string;

    @observable
    results:string[];

    readonly dictionary:WordTrie;
    readonly reverseDictionary:WordTrie;

    constructor() {
        this.query = '';
        this.results = [];
        this.dictionary = new WordTrie();
        this.reverseDictionary = new WordTrie();

        for (const word in words) {
            this.dictionary.addWord(word);
            this.reverseDictionary.addWord(this.reverse(word));
        }
    }
    
    searchPrefix(query:string) {
        this.query = query;
        query = this.sanitize(query);
        const node = this.dictionary.getNodeWithPrefix(query);
        if(node) {
            this.results = node.getWords(query.substring(0, query.length - 1));
        } else {
            this.results = [];
        }
    }
    
    searchSuffix(query:string) {
        this.query = query;
        query = this.sanitize(query);
        query = this.reverse(query);
        const node = this.reverseDictionary.getNodeWithPrefix(query);
        if(node) {
            this.results = node.getWords(query.substring(0, query.length - 1)).map(this.reverse);
        } else {
            this.results = [];
        }
    }
    
    searchPattern(query:string) {
        this.query = query;
        query = this.sanitize(query);
        this.results = this.dictionary.getWordsWithPattern(query);
    }
    
    searchAnagrams(query:string) {
        this.query = query;
        query = this.sanitize(query);

        this.results = this.dictionary.getAnagrams(query);
    }
    
    searchNAnagrams(query:string) {
        this.query = query;
        query = this.sanitize(query);

        this.results = this.dictionary.getNAnagrams(query);
    }

    private reverse(word:string):string {
        return word.split('').reverse().join('');
    }

    private sanitize(word:string):string {
        return word.toLowerCase().trim();
    }
}