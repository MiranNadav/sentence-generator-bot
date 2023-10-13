import { sentences } from '../consts';

export const getSentence = () => {
    return sentences[Math.floor(Math.random() * sentences.length)];
}