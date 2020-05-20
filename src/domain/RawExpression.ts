export const ANY = '.';
const GROUP_OPEN = '(';
const GROUP_END = ')';

export enum TokenType {
    Any,
    Letter,
    Group
}

export interface IToken {
    type:TokenType;
    data?:string;
    arrayData?:string[];
}

export class RawExpression {
    tokens:IToken[]

    constructor(pattern:string) {
        this.tokens = this.tokenize(pattern);
    }

    tokenize(expression:string): IToken[] {
        const tokens = [];
        const rawQueue = expression.split('');
        while(rawQueue.length > 0) {
            let value = rawQueue.shift();

            if(!value) continue;

            switch (value) {
                case ANY:
                    tokens.push({type:TokenType.Any});
                    break;

                case GROUP_OPEN:
                    const group:string[] = [];
                    value = rawQueue.shift();
                    while(value !== GROUP_END && rawQueue.length > 0) {
                        if(!value) continue;
                        group.push(value);
                        value = rawQueue.shift();
                    }
                    tokens.push({
                        type:TokenType.Group, 
                        arrayData:group});
                    break;
                default:
                    tokens.push({
                        type:TokenType.Letter, 
                        data:value
                    })
                    break;
            }
        }
        return tokens;
    }
}