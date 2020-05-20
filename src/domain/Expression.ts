import {AnyExpressionNode, LetterExpressionNode, GroupExpressionNode} from './ExpressionNode.js'

const ANY = '.';
const GROUP_OPEN = '(';
const GROUP_END = ')';

export class Expression {
    tokens:AnyExpressionNode[]

    constructor(pattern:string) {
        this.tokens = this.tokenize(pattern);
    }

    tokenize(expression:string): AnyExpressionNode[] {
        const tokens = [];
        const rawQueue = expression.split('');
        while(rawQueue.length > 0) {
            let value = rawQueue.shift();

            if(!value) continue;

            switch (value) {
                case ANY:
                    tokens.push(new AnyExpressionNode());
                    break;

                case GROUP_OPEN:
                    const group = new GroupExpressionNode();
                    value = rawQueue.shift();
                    while(value !== GROUP_END && rawQueue.length > 0) {
                        if(!value) continue;
                        group.addNode(new LetterExpressionNode(value));
                        value = rawQueue.shift();
                    }
                    break;
                default:
                    tokens.push(new LetterExpressionNode(value))
                    break;
            }
        }
        return tokens;
    }
}