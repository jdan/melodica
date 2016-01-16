const M = require("../")
const assert = require("assert")

describe("initial state", () => {
    it("should have a 440hz sine wave initially", () => {
        const source = M.duration(500)
        const { wave, frequency } = source.streams[0]

        assert.equal(wave, "sine")
        assert.equal(frequency, 440)
    })

    it("should have an initial duration of 0ms", () => {
        const source = M.sine(440)
        const { duration } = source.streams[0]

        assert.equal(duration, 0)
    })

    it("should have an initial delay of 0ms", () => {
        const source = M.sine(440).duration(1000)
        const { delay } = source.streams[0]

        assert.equal(delay, 0)
    })
})

describe("wave generators", () => {
    it("should have a 440hz sine wave initially", () => {
        const source = M
        const { wave, frequency } = source.streams[0]
    })

    it("should generate sine waves", () => {
        const source = M.sine(220)
        const { wave, frequency } = source.streams[0]

        assert.equal(wave, "sine")
        assert.equal(frequency, 220)
    })
})

describe("joining streams", () => {
    it("should be able to join two streams", () => {
        const streamA = M.sine(440).duration(100)
        const streamB = M.triangle(880).delay(50).duration(150)
        const source = M.join(streamA, streamB)

        assert.equal(source.streams.length, 2)

        assert.equal(source.streams[0].wave, "sine")
        assert.equal(source.streams[1].wave, "triangle")

        assert.equal(source.streams[0].duration, 100)
        assert.equal(source.streams[1].duration, 150)
        assert.equal(source.streams[1].delay, 50)
    })

    it("should be able to join many streams", () => {
        const streamA = M.sine(100)
        const streamB = M.triangle(200)
        const streamC = M.square(300)
        const streamD = M.sawtooth(400)

        const source = M.join(streamA, streamB, streamC, streamD)

        assert.equal(source.streams.length, 4)

        assert.equal(source.streams[0].wave, "sine")
        assert.equal(source.streams[1].wave, "triangle")
        assert.equal(source.streams[2].wave, "square")
        assert.equal(source.streams[3].wave, "sawtooth")
    })

    it("should flatten streams", () => {
        const streamA = M.sine(100)
        const streamB = M.triangle(200)
        const firstJoin = M.join(streamA, streamB)

        const streamC = M.square(300)

        const source = M.join(firstJoin, streamC)

        assert.equal(source.streams.length, 3)

        assert.equal(source.streams[0].wave, "sine")
        assert.equal(source.streams[1].wave, "triangle")
        assert.equal(source.streams[2].wave, "square")
    })
})

describe("delay and duration", () => {
    it("should set a duration on a single stream", () => {
        const source = M.sine(440).duration(1000)
        const { duration } = source.streams[0]

        assert.equal(duration, 1000)
    })

    it("should set a delay on a single stream", () => {
        const source = M.sine(440).delay(500).duration(1000)
        const { delay, duration } = source.streams[0]

        assert.equal(delay, 500)
        assert.equal(duration, 1000)
    })

    it("should set a duration on multiple streams", () => {
        const source = M.sine(440).delay(500).duration(1000)
        const { delay, duration } = source.streams[0]

        assert.equal(delay, 500)
        assert.equal(duration, 1000)
    })
})

/**
 * This behavior is a little whacky so let's spec it out here.
 */
describe("methods on joined streams", () => {
    it("should change the wave of all streams", () => {
        const streamA = M.sine(100)
        const streamB = M.triangle(200)
        const streamC = M.square(300)
        const streamD = M.sawtooth(400)

        const source = M.join(streamA, streamB, streamC, streamD).sine(1000)

        assert.equal(source.streams.length, 4)

        assert.equal(source.streams[0].wave, "sine")
        assert.equal(source.streams[1].wave, "sine")
        assert.equal(source.streams[2].wave, "sine")
        assert.equal(source.streams[3].wave, "sine")

        assert.equal(source.streams[0].frequency, 1000)
        assert.equal(source.streams[1].frequency, 1000)
        assert.equal(source.streams[2].frequency, 1000)
        assert.equal(source.streams[3].frequency, 1000)
    })

    it("should change the duration and delay of all streams", () => {
        const streamA = M.sine(100)
        const streamB = M.triangle(200)
        const streamC = M.square(300)
        const streamD = M.sawtooth(400)

        const source =
            M.join(streamA, streamB, streamC, streamD)
             .duration(1000)
             .delay(500)

        assert.equal(source.streams.length, 4)

        assert.equal(source.streams[0].duration, 1000)
        assert.equal(source.streams[1].duration, 1000)
        assert.equal(source.streams[2].duration, 1000)
        assert.equal(source.streams[3].duration, 1000)

        assert.equal(source.streams[0].delay, 500)
        assert.equal(source.streams[1].delay, 500)
        assert.equal(source.streams[2].delay, 500)
        assert.equal(source.streams[3].delay, 500)
    })
})
