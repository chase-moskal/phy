
# 🪐 Phy — portable programming language
- phy will be a super cool, clean, minimal programming language.

# 🦠 Phyto — virtual machine
- stack-based virtual machine and bytecode isa
- ieee 754 float64 is the *only* type — all ops operate on floats
- opcodes are comfy, leaning on host for perf
- `memplz` op requests a 64 kb memory page
- `memcya` op frees a memory page
- `capability` op for calling customizable host functionality
- paginated memory means we can pass off memory pages for real parallelism

