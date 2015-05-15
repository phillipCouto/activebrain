
sessionNumber = 0
subjectNumber = 1001

listOrders = [[1,2,1,2],
              [2,1,2,1],
              [1,2,2,1],
              [2,1,1,2]]

order = subjectNumber % 4
orderSeq = listOrders[order]
listNumber = orderSeq[sessionNumber-1]

console.log(listNumber)