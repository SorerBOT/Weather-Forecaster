import data from "./testingSetShort.json" with { type: "json" };
import forecastTomorrow from "./forecastTomorrow.js";

const transformedData = data.map(entry => 
({
    ...entry,
    tmp_air_max: Math.round(entry.tmp_air_max)
}));

const guessesData = {};

for (let i = 0; i < transformedData.length; i++)
{
    const dayData = transformedData[i];
    const todayTemp = dayData.tmp_air_max;
    const todayKey = todayTemp.toString();

    if (!guessesData[todayKey])
        guessesData[todayKey] =
            {
                totalGuesses: 0,
                correctGuesses: 0,
                sortOfCorrectGuesses: 0
            };

    let forecast;
    try
    {
        forecast = forecastTomorrow(todayTemp);
    }
    catch (error)
    {
        continue;
    }

    if (i < transformedData.length - 1)
    {
        guessesData[todayKey].totalGuesses++;

        const followingDayData = transformedData[i+1];
        const followingDayTemp = followingDayData.tmp_air_max;

        if (forecast === followingDayTemp)
            guessesData[todayKey].correctGuesses++;
        if (Math.abs(forecast - followingDayTemp) <= 2)
            guessesData[todayKey].sortOfCorrectGuesses++;
    }
}

/*
    * Only counting days during which predictions were made.
    * Some temperatures are so infrequent that it is quite impossible
    * To determine what would be the subsequent weather
    */

let totalGuesses = 0;
let totalCorrect = 0;
let totalSortOfCorrect = 0;

for (let key in guessesData)
{
    totalGuesses += guessesData[key].totalGuesses;
    totalCorrect += guessesData[key].correctGuesses;
    totalSortOfCorrect += guessesData[key].sortOfCorrectGuesses;
    console.log(`${key}: correct guesses: ${guessesData[key].correctGuesses}/${guessesData[key].totalGuesses}, ratio: ${guessesData[key].correctGuesses / guessesData[key].totalGuesses}.`);
    console.log(`${key}: sort of correct guesses: ${guessesData[key].sortOfCorrectGuesses}/${guessesData[key].totalGuesses}, ratio: ${guessesData[key].sortOfCorrectGuesses / guessesData[key].totalGuesses}.`);
}

console.log(`Correct guesses: ${totalCorrect}/${totalGuesses}, ratio: ${totalCorrect / totalGuesses}.`);
console.log(`Sort of correct guesses: ${totalSortOfCorrect}/${totalGuesses}, ratio: ${totalSortOfCorrect / totalGuesses}.`);
