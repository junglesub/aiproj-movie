export function getUniqueElements(data) {
  // Initialize a Set to store unique elements
  const uniqueElements = new Set();

  // Iterate over all keys in the object
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      // Add each element of the array to the Set
      data[key].forEach((element) => uniqueElements.add(element));
    }
  }

  // Convert the Set back to an array if needed
  return Array.from(uniqueElements);
}

export function getFirstNElements(data, n) {
  const result = {};

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      result[key] = data[key].slice(0, n);
    }
  }

  return result;
}

export function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();

  arr.forEach((item) => {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  });

  return Array.from(duplicates);
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}
