window.addEventListener("DOMContentLoaded", init);

function init() {
    const segments = [];
    const segment_pcts = [];

    const eye_bonus = [];
    const eye_bonus_pcts = [];

    const total_segment_pct = document.getElementById("total_segment_pct");
    const total_eye_bonus_pct = document.getElementById("total_eye_bonus_pct");

    for (let i = 0; i < 12; i++) {
        segments[i] = document.getElementById(`segment_${i + 1}`);
        segment_pcts[i] = document.getElementById(`segment_pct_${i + 1}`);

        segments[i].addEventListener("change", (ev) => {
            segment_pcts[i].innerText = `(${ev.target.value}%)`;

            const total = segments.reduce((psg, sg) => {
                const ovl = isNaN(parseInt(psg)) ? parseInt(psg.value) : psg;
                return ovl + parseInt(sg.value);
            });
            total_segment_pct.innerText = `(${total}%)`;
        });
    }

    const types = ["no", "half", "full"];
    for (let i = 0; i < 3; i++) {
        eye_bonus[i] = document.getElementById(`eye_bonus_${types[i]}`);
        eye_bonus_pcts[i] = document.getElementById(
            `eye_bonus_pct_${types[i]}`
        );

        eye_bonus[i].addEventListener("change", (ev) => {
            eye_bonus_pcts[i].innerText = `(${ev.target.value}%)`;

            const total = eye_bonus.reduce((psg, sg) => {
                const ovl = isNaN(parseInt(psg)) ? parseInt(psg.value) : psg;
                return ovl + parseInt(sg.value);
            });
            total_eye_bonus_pct.innerText = `(${total}%)`;
        });
    }
}
