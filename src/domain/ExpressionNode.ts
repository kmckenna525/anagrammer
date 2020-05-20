export class AnyExpressionNode {
    matchesLetter(letter:string) {
        return true;
    }
}

export class LetterExpressionNode extends AnyExpressionNode {
    value: string;

    constructor(val:string) {
        super();
        this.value = val;
    }

    matchesLetter(letter:string) {
        return letter === this.value;
    }
}

export class GroupExpressionNode extends AnyExpressionNode {
    children:AnyExpressionNode[];

    constructor() {
        super();
        this.children = [];
    }

    addNode(node:AnyExpressionNode) {
        this.children.push(node);
    }

    matchesLetter(letter:string) {
        for (const child of this.children) {
            if(child.matchesLetter(letter)) {
                return true;
            }
        }
        return false;
    }
}
