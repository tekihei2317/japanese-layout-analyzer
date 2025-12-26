declare module "kuromoji" {
  export type Token = {
    surface_form: string;
    reading?: string;
  };

  export type Tokenizer = {
    tokenize(input: string): Token[];
  };

  export type Builder = {
    build(callback: (error: Error | null, tokenizer: Tokenizer) => void): void;
  };

  export const builder: (options: { dicPath: string }) => Builder;

  const kuromoji: {
    builder: typeof builder;
  };

  export default kuromoji;
}
