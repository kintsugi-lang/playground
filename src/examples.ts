export type Example = {
  id: string;
  label: string;
  desc: string;
  target: "" | "love2d" | "playdate";
  snippet: string;
  source: string;
};

export const examples: Example[] = [
  {
    id: "hello",
    label: "Hello World",
    desc: "Functions and loop/collect.",
    target: "",
    snippet: `print "Hello, Kintsugi!"

add: function [a b] [a + b]
print rejoin ["2 + 3 = " (add 2 3)]

squares: loop/collect [
  for [n] from 1 to 5 do [n * n]
]
print rejoin ["Squares: " squares]`,
    source: `print "Hello, Kintsugi!"

add: function [a b] [a + b]
print rejoin ["2 + 3 = " (add 2 3)]

squares: loop/collect [
  for [n] from 1 to 5 do [n * n]
]
print rejoin ["Squares: " squares]`,
  },
  {
    id: "basics",
    label: "Closures",
    desc: "Contexts, closures, and control flow.",
    target: "",
    snippet: `fact: function [n] [
  if n = 0 [return 1]
  return n * fact (n - 1)
]
print fact 10

make-adder: function [n] [
  function [x] [x + n]
]
add5: make-adder 5
print add5 10`,
    source: `; Arithmetic, functions, control flow, closures

x: 10
y: 3
print x + y
print x * y
print 2 + 3 * 4

add: function [a b] [a + b]
print add 3 4

; Factorial (recursion)
fact: function [n] [
  if n = 0 [return 1]
  return n * fact (n - 1)
]
print fact 10

either 5 > 3 [print "yes"] [print "no"]

loop [for [n] from 1 to 5 do [print n]]

; Context (named record)
point: context [x: 10 y: 20]
print point/x
print point/y
point/x: 99
print point/x

; Closures
make-adder: function [n] [
  function [x] [x + n]
]
add5: make-adder 5
print add5 10

print uppercase "hello"
print join "hello" " world"`,
  },
  {
    id: "objects",
    label: "Objects",
    desc: "Typed objects and pattern matching.",
    target: "",
    snippet: `Ability: object [
  field/required [name [string!]]
  field/required [power [integer!]]
  field/required [kind [string!]]
]

slash: make Ability [
  name: "Slash" power: 25 kind: "physical"
]

match slash/kind [
  ["heal"]    [print "healing"]
  ["physical"] [print "attacking"]
  default     [print "unknown"]
]`,
    source: `; Objects, match dialect, constructors

Ability: object [
  field/required [name [string!]]
  field/required [power [integer!]]
  field/required [kind [string!]]
]

slash:    make Ability [name: "Slash"    power: 25  kind: "physical"]
fireball: make Ability [name: "Fireball" power: 30  kind: "fire"]
heal:     make Ability [name: "Heal"     power: 20  kind: "heal"]

Unit: object [
  field/required [name [string!]]
  field/required [hp [integer!]]
  field/required [max-hp [integer!]]
  field/required [attack [integer!]]
  field/required [defense [integer!]]
]

hero: make Unit [
  name: "Kael" hp: 100 max-hp: 100
  attack: 15 defense: 10
]

calc-damage: function [atk [unit!] ability [ability!] def [unit!] return: [integer!]] [
  dmg: atk/attack + ability/power - def/defense
  if dmg < 1 [dmg: 1]
  dmg
]

apply-ability: function [user [unit!] ability [ability!] target [unit!]] [
  match ability/kind [
    ["heal"] [
      print rejoin [user/name " heals " target/name]
    ]
    default [
      dmg: calc-damage user ability target
      target/hp: target/hp - dmg
      if target/hp < 0 [target/hp: 0]
      print rejoin [
        user/name " uses " ability/name " on " target/name
        " for " dmg " (" target/hp "/" target/max-hp ")"
      ]
    ]
  ]
]

enemy: make Unit [
  name: "Goblin" hp: 50 max-hp: 50
  attack: 8 defense: 3
]

apply-ability hero slash enemy
apply-ability hero fireball enemy
print rejoin [enemy/name " HP: " enemy/hp]`,
  },
  {
    id: "pong",
    label: "Pong",
    desc: "Compile-time @game dialect. We have E and C, bring your own S.",
    target: "love2d",
    snippet: `@game [
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
]`,
    source: `Kintsugi [name: 'pong]

reset-ball: function [b dir] [
  b/x: 396  b/y: 296
  b/dx: dir
  b/dy: 0
  b/speed: 350
]

@game [
  constants [
    SCREEN-W: 800
    SCREEN-H: 600
    PADDLE-SPEED: 420
    BALL-ACCEL: 20
    BALL-RADIUS: 8
  ]

  group 'main [
    state [
      paused?: false
      player-score: 0
      cpu-score: 0
    ]

    on-update [if paused? [return]]

    entity player [
      pos 20 260  rect 12 80  color 0.9 0.9 1
      tags [paddle]
      update [
        if love/keyboard/isDown "w" [self/y: self/y - (PADDLE-SPEED * dt)]
        if love/keyboard/isDown "s" [self/y: self/y + (PADDLE-SPEED * dt)]
      ]
    ]

    entity cpu [
      pos 768 260  rect 12 80  color 0.9 0.9 1
      tags [paddle]
      update [self/y: ball/y - 40]
    ]

    entity ball [
      pos 396 296  rect 8 8  color 1 0.8 0.2
      field dx 1
      field dy 0
      field speed 350
      update [
        self/x: self/x + (self/dx * self/speed * dt)
        self/y: self/y + (self/dy * self/speed * dt)
        if self/y < 0 [
          self/y: 0
          self/dy: negate self/dy
        ]
        if self/y > (SCREEN-H - BALL-RADIUS) [
          self/y: SCREEN-H - BALL-RADIUS
          self/dy: negate self/dy
        ]
        if self/x < 0 [
          cpu-score: cpu-score + 1
          reset-ball self 1
        ]
        if self/x > SCREEN-W [
          player-score: player-score + 1
          reset-ball self -1
        ]
      ]
    ]

    collide ball 'paddle [
      ball/dx: negate ball/dx
      ball/dy: (ball/y - it/y) / 40
      ball/speed: ball/speed + BALL-ACCEL
    ]

    draw [
      love/graphics/print rejoin [player-score "   " cpu-score] 380 20
    ]
  ]

  go 'main
]

love/keypressed: function [key] [
  match key [
    ["space"]  [paused?: not paused?]
    ["escape"] [love/event/quit]
    default    []
  ]
]`,
  },
  {
    id: "types",
    label: "Custom Types",
    desc: "Subset types with where guards.",
    target: "",
    snippet: `positive!: @type/where [integer!] [it > 0]

clamp-positive: function [n [positive!]] [n]
print clamp-positive 42

score!: @type/where [integer! | string!] [
  match it [
    [integer!] [(it >= 0) and (it <= 100)]
    [string!]  [it = "N/A"]
    default    [false]
  ]
]
print is? score! 85
print is? score! "N/A"
print is? score! -5`,
    source: `positive!: @type/where [integer!] [it > 0]

clamp-positive: function [n [positive!]] [n]
print clamp-positive 42

score!: @type/where [integer! | string!] [
  match it [
    [integer!] [(it >= 0) and (it <= 100)]
    [string!]  [it = "N/A"]
    default    [false]
  ]
]
print is? score! 85
print is? score! "N/A"
print is? score! -5`,
  },
  {
    id: "match",
    label: "Pattern Matching",
    desc: "The match dialect with guards and destructuring.",
    target: "",
    snippet: `classify: function [n [integer!]] [
  match n [
    [0]         ["zero"]
    [negative?] ["negative"]
    [1]         ["one"]
    default     ["other"]
  ]
]

print classify 0
print classify -5
print classify 1
print classify 42`,
    source: `classify: function [n [integer!]] [
  match n [
    [0]         ["zero"]
    [negative?] ["negative"]
    [1]         ["one"]
    default     ["other"]
  ]
]

print classify 0
print classify -5
print classify 1
print classify 42

traffic-light-color!: @type/enum ['red | 'yellow | 'green]

TrafficLight: object [
  field/optional [state [traffic-light-color!] 'red]
]

advance: function [light [traffic-light!]] [
  match light/state [
    ['red]    [light/state: 'green]
    ['green]  [light/state: 'yellow]
    ['yellow] [light/state: 'red]
  ]
]

light: make TrafficLight []
print light/state
advance light
print light/state
advance light
print light/state`,
  },
  {
    id: "loops",
    label: "Loops",
    desc: "Collect, partition, and iterate.",
    target: "",
    snippet: `; Collect squares
squares: loop/collect [
  for [n] from 1 to 5 do [n * n]
]
print squares

; Partition evens and odds
set [evens odds] loop/partition [
  for [x] in [1 2 3 4 5 6] do [
    (x % 2) = 0
  ]
]
print evens
print odds`,
    source: `; Collect squares
squares: loop/collect [
  for [n] from 1 to 5 do [n * n]
]
print squares

; Partition evens and odds
set [evens odds] loop/partition [
  for [x] in [1 2 3 4 5 6] do [
    (x % 2) = 0
  ]
]
print evens
print odds

; Basic iteration
loop [for [n] from 1 to 10 do [print n]]

; Iterate with when filter
big: loop/collect [
  for [x] in [3 17 8 42 1 99] when [x > 10] do [x]
]
print big`,
  },
  {
    id: "money",
    label: "Money",
    desc: "Cent-exact arithmetic. No float drift.",
    target: "",
    snippet: `price: $19.99
tax: $19.99 * 0.08
total: price + tax

print rejoin ["Price: " price]
print rejoin ["Tax:   " tax]
print rejoin ["Total: " total]

; Money is isolated from integers
; $100 + 42 would be a type error
; $100 = 100 is false`,
    source: `price: $19.99
tax: $19.99 * 0.08
total: price + tax

print rejoin ["Price: " price]
print rejoin ["Tax:   " tax]
print rejoin ["Total: " total]

; Money is isolated from integers
; $100 + 42 would be a type error
; $100 = 100 is false`,
  },
];
