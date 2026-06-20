export { loadTerms, buildTermIndex } from "./parser/loader"
export type { Term } from "./parser/loader"

export { parseLine } from "./parser/index"
export type { TermMatch } from "./parser/index"

export { injectComments } from "./injector/index"
export type { InjectorOptions, InjectionResult } from "./injector/index"

export { SpacedRepetition, MAX_NEW_TERMS_PER_SESSION } from "./spaced-rep/index"
export type { SpacedRepStats } from "./spaced-rep/index"
