const getRandom = (arr: Array<any>, n: number = 1) => {
  if (n < 1) throw new Error('the number of random samples must be positive')
  if (n > arr.length) throw new Error('the number of random samples must be less than the array lenght')

  const dupArr = [...arr]
  const result = []

  for (let i = 1; i <= n; i++) {
    const randomIndex = Math.floor((Math.random() * dupArr.length))
    result.push(dupArr.splice(randomIndex, 1)[0])
  }

  return n === 1 ? result[0] : result;
}

export default getRandom
