/**
 * const first = B.sine(440)
 *  .volume(0.2)
 *  .duration(1000)
 *  .lowpass(0, { exponentialTo: 400, duration: 2000 })
 *  .highpass(1500);
 *
 * const second = B.sine(880)
 *  .volume(0.2)
 *  .delay(500)
 *  .duration(500);
 *
 * const example = B.join(first, second);
 */

// Initial state
const Melodica = {
    streams: [
        {
            wave: "sine",
            frequency: 440,
            volume: 0.5,
            delay: 0,
            duration: 0,
            filters: [],
        }
    ],
}

Melodica.wave = function(wave, frequency) {
    return {
        ...Melodica,
        streams: this.streams.map((stream) => {
            return {
                ...stream,
                wave,
                frequency,
            }
        }),
    }
}

Melodica.sine     = function(frequency) { return this.wave("sine",     frequency) }
Melodica.square   = function(frequency) { return this.wave("square",   frequency) }
Melodica.triangle = function(frequency) { return this.wave("triangle", frequency) }
Melodica.sawtooth = function(frequency) { return this.wave("sawtooth", frequency) }

Melodica.duration = function(duration) {
    return {
        ...Melodica,
        streams: this.streams.map((stream) => {
            return {
                ...stream,
                duration,
            }
        }),
    }
}

Melodica.delay = function(delay) {
    return {
        ...Melodica,
        streams: this.streams.map((stream) => {
            return {
                ...stream,
                delay,
            }
        }),
    }
}

Melodica.play = function() {
    this.streams.forEach((stream) => {
        const {
            wave,
            frequency,
            delay,
            duration,
        } = stream

        const source = audioContext.createOscillator()

        source.type = wave
        source.frequency.value = frequency

        source.start(audioContext.currentTime + (delay / 1000))
        source.stop(audioContext.currentTime + ((delay + duration) / 1000))

        // Effects

        source.connect(audioContext.destination)
    })
}

Melodica.join = (...sources) => {
    return {
        ...Melodica,
        streams: sources.reduce((acc, source) => {
            return acc.concat(source.streams)
        }, []),
    }
}

const example = {
    streams: [
        {
            wave: "sine",
            // Change frequency over time? Or could that be an effect
            frequency: 440,
            volume: 0.2,
            delay: 0,
            duration: 1000,
            filters: [
                {
                    filter: "highpass",
                    value: {
                        type: "constant",
                        value: 1500,
                    },
                },
                {
                    filter: "lowpass",
                    value: {
                        type: "exponential",
                        initial: 0,
                        end: 2000,
                        duration: 2000,
                    },
                },
            ]
        },
        {
            wave: "sine",
            frequency: 880,
            volume: 0.2,
            delay: 500,
            duration: 500,
        }
    ]
};

if (typeof window !== "undefined") {
    window.audioContext = new AudioContext()
    window.play = () => {
        const joined = Melodica.join(
            Melodica.sine(440).duration(1000),
            Melodica.sine(880).duration(500).delay(500)
        )

        console.log(joined)
        joined.play()
    }
}

module.exports = Melodica
