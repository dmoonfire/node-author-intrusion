/**
 * Identifies a location within a file as line and character.
 */
export class Location {
  constructor(
    path: string = null,
    beginLine: number = -1,
    beginColumn: number = -1,
    endLine: number = -1,
    endColumn: number = -1) {
    this.path = path;
    this.beginLine = +beginLine;
    this.beginColumn = +beginColumn;
    this.endLine = +endLine;
    this.endColumn = +endColumn;
  }

  path: string;
  beginLine: number;
  beginColumn: number;
  endLine: number;
  endColumn: number;
}

/**
 * Represents a token of a line, sentence, or paragraph. A token can either be
 * a single word or punctuation, or it can represent a processed token such as
 * a stemmed version of a word.
 */
export class Token {
  constructor(location: Location, text: string)
  {
    this.location = location;
    this.text = text.toLowerCase();
    this.original = text;
  }

  public location: Location;
  public text: string;
  public original: string;
  public index: number;
}

export interface TokenContainer
{
  tokens: Token[];
}

/**
 * Represents a single physical line inside a content file.
 */
export class Line implements TokenContainer {
  constructor(location: Location, text: string) {
    this.location = location;
    this.text = text;
    this.tokens = new Array<Token>();
  }

  location: Location;
  text: string;
  tokens: Token[];
}

/**
 * A single logical sentence within a paragraph.
 */
export class Sentence implements TokenContainer
{
  tokens: Token[];
}

/**
 * Represents a single logical paragraph inside a content file. This is based on
 * one or more physical lines (Line) based on parsing settings.
 */
export class Paragraph implements TokenContainer
{
  tokens: Token[];
}

/**
 * The contents of a single file inside a project. This encapsulates the
 * individual lines, sentences, and split out elements that represent the
 * textual content.
 */
export class Content implements TokenContainer {
  constructor() {
    this.lines = new Array<Line>();
    this.tokens = new Array<Token>();
  }

  path: string;
  lines: Line[];
  tokens: Token[];

	/**
	 * A collection of processing flags (represented by strings) that identify
	 * which processing has been performed on the entire contents.
	 */
  processed: string[];

  metadata: any;
  project: Project;

  getScopedTokens(scope: string): TokenContainer[]
  {
    if (!scope)
    {
      scope = "document";
    }

    switch (scope)
    {
      case "document":
        var documents = Array<TokenContainer>();
        documents.push(this);
        return documents;

      case "lines":
        return this.lines;

      default:
        throw new Error("Unknown scope " + scope + ". Must be document or lines.");
    }
  }

  indexOfText(input: string, start: number): number {
    for (var i = start; i < this.lines.length; i++) {
      if (this.lines[i].text === "---") {
        return i;
      }
    }

    return -1;
  }

	/**
	 * Retrieves a combined string of all the lines between two line
     * indexes.
	 */
  getText(start: number, end: number): string {
    var buffer: string = "";

    for (var i = start; i < end; i++) {
      buffer += this.lines[i].text;
      buffer += "\n";
    }

    return buffer;
  }
}

export class Analysis {
  name: string;
  plugin: string;
  options: any;
  scope: string; // document, line
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
  Error,
  Warning,
  Info
}

/**
 * The settings and configuration for a collected series of content
 * files.
 */
export class Project {
  public constructor(data) {
    this.name = data.name;
    this.analysis = new Array<Analysis>();

    if (data.analysis) {
      this.analysis = data.analysis;
    }
  }

  public name: string;
  public analysis: Analysis[];
}
