export type Example = {
  id: string;
  label: string;
  target: "" | "love2d" | "playdate";
  source: string;
};

export const examples: Example[] = [
  {
    id: "hello",
    label: "Hello",
    target: "",
    source: `print "Hello, Kintsugi!"

add: function [a b] [a + b]
print rejoin ["2 + 3 = " (add 2 3)]

squares: loop/collect [for [n] from 1 to 5 do [n * n]]
print rejoin ["Squares: " squares]

qsort: function [blk] [
  if (length blk) <= 1 [return blk]
  pivot: first blk
  rest: copy blk
  remove rest 1
  set [lo hi] loop/partition [for [x] in rest do [x < pivot]]
  result: qsort lo
  append result pivot
  loop [for [x] in qsort hi do [append result x]]
  result
]

print rejoin ["Sorted: " qsort [3 1 4 1 5 9 2 6]]`,
  },
  {
    id: "basics",
    label: "Basics",
    target: "",
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
    id: "combat",
    label: "Combat",
    target: "",
    source: `; Objects, match dialect, constructors
; (excerpt from the full combat sim)

Ability: object [
  field/required [name [string!]]
  field/required [power [integer!]]
  field/required [kind [string!]]
]

slash:    make Ability [name: "Slash"    power: 25  kind: "physical"]
fireball: make Ability [name: "Fireball" power: 30  kind: "fire"]
heal:     make Ability [name: "Heal"     power: 20  kind: "heal"]
poison:   make Ability [name: "Poison"   power: 8   kind: "dot"]

Unit: object [
  field/required [name [string!]]
  field/required [hp [integer!]]
  field/required [max-hp [integer!]]
  field/required [attack [integer!]]
  field/required [defense [integer!]]
  field/required [speed [integer!]]
  field/required [abilities [block!]]
]

make-warrior: function [n [string!]] [
  make Unit [
    name: n  hp: 100  max-hp: 100
    attack: 15  defense: 10  speed: 8
    abilities: ["slash"]
  ]
]

make-mage: function [n [string!]] [
  make Unit [
    name: n  hp: 70  max-hp: 70
    attack: 8  defense: 5  speed: 12
    abilities: ["fireball" "poison"]
  ]
]

alive?: function [unit [unit!]] [unit/hp > 0]

clamp: function [val [integer!] lo [integer!] hi [integer!] return: [integer!]] [
  if val < lo [return lo]
  if val > hi [return hi]
  val
]

calc-damage: function [attacker [unit!] ability [ability!] defender [unit!] return: [integer!]] [
  dmg: attacker/attack + ability/power - defender/defense
  if dmg < 1 [dmg: 1]
  dmg
]

; Pattern matching on ability kind
apply-ability: function [user [unit!] ability [ability!] target [unit!]] [
  match ability/kind [
    ["heal"] [
      amount: clamp ability/power 0 (target/max-hp - target/hp)
      target/hp: target/hp + amount
      print rejoin [
        "  " user/name " heals " target/name
        " for " amount " HP"
        " (" target/hp "/" target/max-hp ")"
      ]
    ]
    ["dot"] [
      dmg: ability/power
      target/hp: target/hp - dmg
      if target/hp < 0 [target/hp: 0]
      print rejoin [
        "  " user/name " poisons " target/name
        " for " dmg " damage"
        " (" target/hp "/" target/max-hp ")"
      ]
    ]
    default [
      dmg: calc-damage user ability target
      target/hp: target/hp - dmg
      if target/hp < 0 [target/hp: 0]
      print rejoin [
        "  " user/name " uses " ability/name " on " target/name
        " for " dmg " damage"
        " (" target/hp "/" target/max-hp ")"
      ]
    ]
  ]
]

hero: make-warrior "Kael"
mage: make Unit [
  name: "Lyra"  hp: 70  max-hp: 70
  attack: 8  defense: 5  speed: 12
  abilities: ["fireball"]
]

apply-ability hero slash mage
apply-ability mage fireball hero
print rejoin ["Kael HP: " hero/hp]
print rejoin ["Lyra HP: " mage/hp]`,
  },
  {
    id: "pong",
    label: "Pong (@game)",
    target: "love2d",
    source: `Kintsugi [name: 'pong]

; Pong - demonstrates the @game dialect
; Requires target: love2d

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
];
