
// Жутко кривая функция... но эт скорее что бы иметь возможность в будущем заменить ее на детерминированный RNG
export function getRandomNumber(maxValue: number, minValue: number = 1) {
    return Math.floor(maxValue * Math.random()) + minValue;
}