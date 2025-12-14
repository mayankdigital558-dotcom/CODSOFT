const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        let key = btn.dataset.key;

        if (key === "C") display.value = "";
        else if (key === "DEL") display.value = display.value.slice(0, -1);
        else if (key === "=") {
            try {
                display.value = eval(display.value);
            } catch {
                display.value = "Error";
            }
        } else {
            display.value += key;
        }
    });
});
