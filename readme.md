
# 🪐 Phy — portable programming language

```wisp
fn mix [x y factor] {
  let diff (sub y x)
  let z (mul diff factor)
  ret (add x z)
}

fn make-counter {
  mut n 0
  ret #[
    get (fn {x})
    increment (fn (set n (add n 1)))
    decrement (fn (set n (sub n 1)))
  ]
}

let counter (make-counter)
log counter.get // 0

counter.increment
counter.increment
log counter.get // 2

counter.decrement
log counter.get // 1
```

# 🦠 Phyto — virtual machine
- stack-based virtual machine and bytecode isa
- only one type — the god-tier type — ieee 754 float64
- all opcodes operate on floats!
- opcodes are comfy, leaning on host for perf
- `memplz` op requests a 64 kb memory page
- `memcya` op frees a memory page
- `capability` op for calling customizable host functionality
- paginated memory means we can pass off memory pages for real parallelism

