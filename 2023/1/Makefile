#-------------------------------------------------------------------------------
# Global stuff.

SHELL:=bash
GO=$(shell which go)

#-------------------------------------------------------------------------------
# Running `make` will show the list of subcommands that will run.

all: help

.PHONY: help
## help: [help] Prints this help message.
help:
	@ echo "Usage:"
	@ echo ""
	@ sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' | sed -e 's/^/ /' | \
		while IFS= read -r line; do \
      echo "$$line"; \
		done

#-------------------------------------------------------------------------------
# Installation

.PHONY: install-tools-go
## install-tools-go: [tools] Install/upgrade the required Go packages.
install-tools-go:
	@ echo " "
	@ echo "=====> Installing Go packages..."
	$(GO) install golang.org/x/perf/cmd/benchstat@latest

#-------------------------------------------------------------------------------
# Compile

.PHONY: tidy
## tidy: [build] Updates go.mod and downloads dependencies.
tidy:
	@ echo " "
	@ echo "=====> Tidy and download the Go dependencies..."
	$(GO) mod tidy -go=1.21 -v

#-------------------------------------------------------------------------------
# Test

.PHONY: test
## test: [test] Runs unit tests.
test:
	@ echo " "
	@ echo "=====> Running unit tests..."
	go test -count=1 -parallel=$(shell nproc) -timeout 30s -coverpkg=./... -coverprofile=__coverage.out -v ./...

.PHONY: bench
## bench: [test]* Runs the benchmarks with enough data for analysis with benchstat.
bench:
	@ echo " "
	@ echo "=====> Running benchmark..."
	$(GO) test -bench=. -count=6 -timeout 60m -benchmem -cpuprofile=__cpu.out -memprofile=__mem.out -trace=__trace.out . | tee __bench-$(shell date --utc "+%Y%m%dT%H%M%SZ").out

.PHONY: view-cov-cli
## view-cov-cli: [test] After running test or unittest, this will view the coverage report on the CLI.
view-cov-cli:
	gocovsh --profile=__coverage.out

.PHONY: view-cov-html
## view-cov-html: [test] After running test or unittest, this will launch a browser to view the coverage report.
view-cov-html:
	$(GO) tool cover -html=__coverage.out

.PHONY: view-cpupprof
## view-cpupprof: [test] After running bench, this will launch a browser to view the CPU profiler results.
view-cpupprof:
	$(GO) tool pprof -http :8080 __cpu.out

.PHONY: view-mempprof
## view-mempprof: [test] After running bench, this will launch a browser to view the memory profiler results.
view-mempprof:
	$(GO) tool pprof -http :8080 __mem.out

.PHONY: view-trace
## view-trace: [test] After running bench, this will launch a browser to view the trace results.
view-trace:
	$(GO) tool trace __trace.out
