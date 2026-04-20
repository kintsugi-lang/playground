export type Example = {
  id: string;
  label: string;
  desc: string;
  target: "" | "love2d" | "playdate";
  snippet: string;
  source: string;
};

const hello = `print "Hello, Kintsugi!"

add: function [a b] [a + b]
print rejoin ["2 + 3 = " (add 2 3)]

squares: loop/collect [
  for [n] from 1 to 5 do [n * n]
]
print rejoin ["Squares: " squares]`;

const basics = `; Variables, arithmetic, comparisons.
x: 10
y: 3
print x + y               ; 13
print 2 + 3 * 4           ; 20 (left-to-right, no precedence)

; Control flow -- either is the expression form of if/else.
print either x > y ["big"] ["small"]

; loop with for/from/to/do.
loop [for [n] from 1 to 5 do [print n]]`;

const closures = `; Functions close over their defining scope.
make-adder: function [n] [
  function [x] [x + n]
]

add5: make-adder 5
add100: make-adder 100
print add5 10             ; 15
print add100 10           ; 110

; Recursion works as expected.
fact: function [n] [
  if n = 0 [return 1]
  return n * fact (n - 1)
]
print fact 10             ; 3628800`;

const loops = `; loop/collect gathers each do-body result into a block.
squares: loop/collect [
  for [n] from 1 to 5 do [n * n]
]
print squares             ; [1 4 9 16 25]

; loop/partition splits by a predicate -- returns [truthy falsy].
set [evens odds] loop/partition [
  for [x] in [1 2 3 4 5 6] do [(x % 2) = 0]
]
print evens               ; [2 4 6]
print odds                ; [1 3 5]

; when filters before do.
big: loop/collect [
  for [x] in [3 17 8 42 1 99] when [x > 10] do [x]
]
print big                 ; [17 42 99]`;

const match = `; match is a dialect: each [pattern] [body] pair is tried in order.
; A bare word in [pattern] captures the value; 'when [guard] refines.
classify: function [n [integer!]] [
  match n [
    [0]                  ["zero"]
    [x] when [x < 0]     ["negative"]
    [x] when [x > 100]   ["huge"]
    default              ["other"]
  ]
]

print classify 0          ; zero
print classify -5         ; negative
print classify 500        ; huge
print classify 42         ; other`;

const types = `; @type/where -- subset type via guard. 'it is the candidate.
positive!: @type/where [integer!] [it > 0]

clamp-positive: function [n [positive!] return: [positive!]] [n]
print clamp-positive 42   ; 42

; Unions with per-branch guards.
score!: @type/where [integer! | string!] [
  match it [
    [integer!] [(it >= 0) and (it <= 100)]
    [string!]  [it = "N/A"]
    default    [false]
  ]
]
print is? score! 85       ; true
print is? score! "N/A"    ; true
print is? score! -5       ; false`;

const objects = `; object declares a template with typed fields.
Ability: object [
  field/required [name [string!]]
  field/required [power [integer!]]
  field/required [kind [string!]]
]

; make stamps a context from the template.
slash: make Ability [
  name: "Slash" power: 25 kind: "physical"
]

; match dispatches on any value, including a field.
match slash/kind [
  ["heal"]     [print "healing"]
  ["physical"] [print rejoin [slash/name " hits for " slash/power]]
  default      [print "unknown"]
]`;

const money = `; money! is cent-exact -- no float drift.
price: $19.99
tax: price * 0.08
total: price + tax

print rejoin ["Price: " price]      ; Price: $19.99
print rejoin ["Tax:   " tax]        ; Tax:   $1.60
print rejoin ["Total: " total]      ; Total: $21.59

; money is isolated from integers:
; $100 + 42    -- type error
; $100 = 100   -- false`;

const metaprog = `; Code is data. Templates rewrite blocks at the call site.
; @preprocess runs at compile time and emits AST.

; @template -- declarative macro, splices args via (paren).
@template unless: [cond body [block!]] [
  if not (cond) (body)
]
unless (1 > 10) [print "math works"]   ; math works

; @preprocess -- run real Kintsugi at parse time. emit
; injects code into the output program. Generate a family
; of functions from a data list, no boilerplate.
@preprocess [
  loop [for [op] in [double triple quadruple] do [
    n: match op [
      ['double]    [2]
      ['triple]    [3]
      ['quadruple] [4]
    ]
    emit @compose/deep [
      (to set-word! op) function [x] [x * (n)]
    ]
  ]]
]

print double 5      ; 10
print triple 5      ; 15
print quadruple 5   ; 20`;

const attempt = `; attempt is an error-aware pipeline. Each step receives
; the previous result as 'it'. Errors short-circuit to a
; matching 'catch by symbol kind. 'fallback is last resort.

result: attempt [
  source ["  Hello, World  "]
  then   [trim it]
  then   [lowercase it]
  then   [split it ", "]
]
print result        ; ["hello" "world"]

; Without 'source the pipeline becomes a reusable function.
clean: attempt [
  when [not empty? it]
  then [trim it]
  then [lowercase it]
]
print clean "  HEY  "      ; hey

; Errors are typed by symbol. catch dispatches by kind.
recover: attempt [
  source [error 'parse "bad input"]
  catch 'parse [rejoin ["recovered: " error]]
  fallback ["unknown failure"]
]
print recover       ; recovered: bad input`;

const dispatch = `; match destructures blocks, binds names, guards with 'when.
; First matching arm wins. Patterns can mix lit-words, types,
; and bare names.

describe: function [shape] [
  match shape [
    ['circle r]            [rejoin ["circle r=" r]]
    ['rect w h] when [w = h]
                           [rejoin ["square " w]]
    ['rect w h]            [rejoin ["rect " w "x" h]]
    [kind tail]            [rejoin ["unknown: " kind]]
    default                ["empty"]
  ]
]

print describe ['circle 5]         ; circle r=5
print describe ['rect 4 4]         ; square 4
print describe ['rect 3 7]         ; rect 3x7
print describe ['triangle 1 2 3]   ; unknown: triangle
print describe []                  ; empty`;

const pong = `@game [
  constants [
    SCREEN-W: 800
    SCREEN-H: 600
    PADDLE-SPEED: 420
  ]

  group 'main [
    entity player [
      pos 20 260  rect 12 80
      update [
        if love/keyboard/isDown "w" [
          self/y: self/y - (PADDLE-SPEED * dt)
        ]
      ]
    ]

    entity ball [
      pos 396 296  rect 8 8
      field dx 1  field speed 350
      update [
        self/x: self/x + (self/dx * self/speed * dt)
      ]
    ]

    collide ball 'paddle [
      ball/dx: negate ball/dx
    ]
  ]
  go 'main
]`;

export const examples: Example[] = [
  {
    id: "hello",
    label: "Hello World",
    desc: "Functions, rejoin, loop/collect.",
    target: "",
    snippet: hello,
    source: hello,
  },
  {
    id: "basics",
    label: "Basics",
    desc: "Variables, arithmetic, control flow.",
    target: "",
    snippet: basics,
    source: basics,
  },
  {
    id: "closures",
    label: "Closures",
    desc: "Functions closing over scope, recursion.",
    target: "",
    snippet: closures,
    source: closures,
  },
  {
    id: "loops",
    label: "Loops",
    desc: "Collect, partition, filter.",
    target: "",
    snippet: loops,
    source: loops,
  },
  {
    id: "match",
    label: "Pattern Matching",
    desc: "The match dialect, with predicates and defaults.",
    target: "",
    snippet: match,
    source: match,
  },
  {
    id: "types",
    label: "Custom Types",
    desc: "Subset types with where-guards.",
    target: "",
    snippet: types,
    source: types,
  },
  {
    id: "objects",
    label: "Objects",
    desc: "Typed fields, make, match on field access.",
    target: "",
    snippet: objects,
    source: objects,
  },
  {
    id: "money",
    label: "Money",
    desc: "Cent-exact arithmetic. No float drift.",
    target: "",
    snippet: money,
    source: money,
  },
  {
    id: "dispatch",
    label: "Destructuring",
    desc: "match binds names, guards, and falls through arms in order.",
    target: "",
    snippet: dispatch,
    source: dispatch,
  },
  {
    id: "attempt",
    label: "Error Pipelines",
    desc: "attempt threads `it`, catches by symbol, falls back.",
    target: "",
    snippet: attempt,
    source: attempt,
  },
  {
    id: "metaprog",
    label: "Metaprogramming",
    desc: "@template + @preprocess: compile-time codegen from data.",
    target: "",
    snippet: metaprog,
    source: metaprog,
  },
  {
    id: "pong",
    label: "Pong",
    desc: "Compile-time @game dialect. We have E and C, bring your own S.",
    target: "love2d",
    snippet: pong,
    source: pong,
  },
];
