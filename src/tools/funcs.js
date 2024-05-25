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
