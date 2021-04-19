mkdir build
deno compile --unstable -A --lite --quiet -o build/ghfetch-windows-x86_64 --target x86_64-pc-windows-msvc ghfetch.ts
deno compile --unstable -A --lite --quiet -o build/ghfetch-linux-gnu-x86_64 --target x86_64-unknown-linux-gnu ghfetch.ts
deno compile --unstable -A --lite --quiet -o build/ghfetch-darwin-x86_64 --target x86_64-apple-darwin ghfetch.ts
deno compile --unstable -A --lite --quiet -o build/ghfetch-darwin-aarch64 --target aarch64-apple-darwin ghfetch.ts