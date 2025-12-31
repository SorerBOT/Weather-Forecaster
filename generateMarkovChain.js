import data from "./trainingSetLong.json" with { type: "json" };
import { writeFile } from "fs/promises";

const transformedData = data.map(entry => 
({
    ...entry,
    tmp_air_max: Math.round(entry.tmp_air_max)
}));

const occurrences = {};
const transitionProbabilities = {};
const transitionsNormalised = {};

let maxTemp = transformedData[0].tmp_air_max;
let minTemp = transformedData[0].tmp_air_max;

transformedData.forEach(({ tmp_air_max: temp }) =>
{
    if (temp < minTemp) minTemp = temp;
    if (temp > maxTemp) maxTemp = temp;
});

/*
    *  Init transformedData structure
    */
for (let i = minTemp; i <= maxTemp; i++)
{
    const key = i.toString();
    occurrences[key] =
        {
            occurrencesCount: 0,
            transitions: {}
        };
    for (let j = minTemp; j <= maxTemp; j++)
    {
        const transitionKey = j.toString();
        occurrences[key].transitions[transitionKey] = 0;
    }
}

/*
    *   Count in the amount of instances of each event
    */
for (let i = 0; i < transformedData.length; i++)
{
    const dayData = transformedData[i];
    const tempKey = dayData.tmp_air_max.toString();
    occurrences[tempKey].occurrencesCount++;

    if (i < transformedData.length - 1)
    {
        const followingDayData = transformedData[i+1];
        const followingDayTempKey = followingDayData.tmp_air_max.toString();
        occurrences[tempKey].transitions[followingDayTempKey]++;
    }
}

/*
    *   Calculate transition probabilities
    */
for (const key in occurrences)
{
    const occurrencesCount = occurrences[key].occurrencesCount;
    transitionProbabilities[key] = {};
    for (let i = minTemp; i <= maxTemp; i++)
    {
        const transitionKey = i.toString();
        transitionProbabilities[key][transitionKey] = occurrences[key].transitions[transitionKey] / occurrencesCount;
    }
}
/*
    *   Use probabilities to determine where each transition lies on the path [0,1]
    */
for (const key in transitionProbabilities)
{
    let counter = 0;
    transitionsNormalised[key] = {};
    for (let i = minTemp; i <= maxTemp; i++)
    {
        const transitionKey = i.toString();
        const transitionProbability = transitionProbabilities[key][transitionKey];
        if (transitionProbability == null || transitionProbability == 0)
            continue;

        counter += transitionProbability;
        transitionsNormalised[key][transitionKey] = counter;
    }
}

console.log(transitionsNormalised);
await writeFile("transitionProbabilities.json", JSON.stringify(transitionProbabilities, null, 4));
await writeFile("transitionsNormalised.json", JSON.stringify(transitionsNormalised, null, 4));
