declare module "node-author-intrusion" {
    export class Location {
        constructor(path?: string, beginLine?: number, beginColumn?: number, endLine?: number, endColumn?: number);
        path: string;
        beginLine: number;
        beginColumn: number;
        endLine: number;
        endColumn: number;
    }
    export class Token {
        constructor(location: Location, text: string, normalized?: string);
        location: Location;
        text: string;
        normalized: string;
        stem: string;
        index: number;
        partOfSpeech: string;
    }
    export interface TokenContainer {
        tokens: Token[];
    }
    export class Line implements TokenContainer {
        constructor(location: Location, text: string);
        location: Location;
        text: string;
        tokens: Token[];
    }
    export class Sentence implements TokenContainer {
        tokens: Token[];
    }
    export class Paragraph implements TokenContainer {
        tokens: Token[];
    }
    export class Content implements TokenContainer {
        constructor();
        path: string;
        lines: Line[];
        tokens: Token[];
        processed: string[];
        metadata: any;
        project: Project;
        getScopedTokens(scope: string): TokenContainer[];
        indexOfText(input: string, start: number): number;
        getText(start: number, end: number): string;
    }
    export class Analysis {
        name: string;
        plugin: string;
        options: any;
        scope: string;
    }
    export interface AnalysisOutput {
        writeStart(): void;
        writeEnd(): void;
        writeInfo(message: string): void;
        writeWarning(message: string, location: Location): void;
        writeError(message: string, location: Location): void;
    }
    export class AnalysisArguments {
        content: Content;
        analysis: Analysis;
        output: AnalysisOutput;
    }
    export interface AnalysisPlugin {
        process(args: AnalysisArguments): void;
    }
    export enum Severity {
        Error = 0,
        Warning = 1,
        Info = 2,
    }
    export class Project {
        constructor(data: any);
        name: string;
        analysis: Analysis[];
    }
}
