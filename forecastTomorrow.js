import data from "./transitionsNormalised.json" with { type: "json" };

const forecastTomorrow = (todayTemp) =>
{
    const todayTempKey = todayTemp.toString();
    const todayTempData = data[todayTempKey];

    const randomNumber = Math.random();
    for (const key in todayTempData)
    {
        if (randomNumber < todayTempData[key])
        {
            return parseInt(key);
        }
    }

    throw new Error(`could not make forecast for: ${todayTemp}.`);
}

export default forecastTomorrow;
