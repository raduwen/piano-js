import 'regenerator-runtime/runtime';

const NOTES = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
];

class MidiNote {
    constructor(num) {
        this.num = num;
        this.char = NOTES[(num - 36) % NOTES.length];
        this.color = 'white';
        if (this.char.length == 2) {
            this.color = 'black';
        }
    }

    el() {
        const n = document.createElement('div')
        n.className = `key ${this.color}`;
        n.dataset.note = `${this.num}`;
        n.innerHTML = `<span>${this.char}</span>`;
        return n;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('hi')
    let currentInput = null;

    const elInput = (input) => {
        const el = document.createElement('div');
        el.innerText = input.name;
        el.onclick = () => {
            if (currentInput) {
                currentInput.onmidimessage = () => { };
            }
            currentInput = input;
            input.onmidimessage = (e) => {
                const [state, note, velocity] = e.data
                console.log(note);
                if (state == 0x90) {
                    if (velocity > 0) {
                        document.querySelector(`[data-note="${note}"]`).classList.add('down');
                    } else {
                        document.querySelector(`[data-note="${note}"]`).classList.remove('down');
                    }
                }
            };
            el.style.color = 'red';
            console.log(currentInput);
        }
        return el;
    };

    const access = navigator.requestMIDIAccess({ sysex: true }).then((access) => {
        console.log(access);
        // Get lists of available MIDI controllers
        const inputs = access.inputs.values();
        const outputs = access.outputs.values();

        for (const input of inputs) {
            document.getElementById('app-debug').appendChild(elInput(input));
        }

        access.onstatechange = function (e) {
            // Print information about the (dis)connected MIDI controller
            console.log(e.port.name, e.port.manufacturer, e.port.state);
        };
    });

    const piano = document.getElementById('piano');
    Array(61).fill(0).map((v, i) => i + 36).forEach((i) => {
        const midiNote = new MidiNote(i)
        console.log(midiNote)
        piano.appendChild(midiNote.el())
    })
});
