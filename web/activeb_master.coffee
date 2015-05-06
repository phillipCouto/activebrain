_ = Psy._
@Active_Brain = {}

## task namespaces are: AST, ArrowFlanker, TrailsB, RAT
#Participant 1: 1234, 2143, 3412, 4321
#Participant 2: 2143, 3412, 4321, 1234
#Participant 3: 3412, 4321, 1234, 2143
#Participant 4: 4321, 1234, 2143, 3412

window.orderSet =
  1: [[1,2,3,4], [2,1,4,3], [3,4,1,2], [4,3,2,1]]
  2: [[2,1,4,3], [3,4,1,2], [4,3,2,1], [1,2,3,4]]
  3: [[3,4,1,2], [4,3,2,1], [1,2,3,4], [2,1,4,3]]
  4: [[4,3,2,1], [1,2,3,4], [2,1,4,3], [3,4,1,2]]

getOrder = (index) ->
  window.orderSet[(index+1).toString()]


getSession = ->
  $.getJSON( "/session")

getSubject =  ->
  $.getJSON( "/subject")

Active_Brain.teststart = =>

  subject = 100
  session = 4
  tasks = [AST, ArrowFlanker, TrailsB, RAT]
  order = getOrder(subject % 4)[session-1]

  taskSet = for ind in order
    tasks[ind-1]

  Start.start(1, 1)
  .then( -> taskSet[0].start(1,1))
  .then( -> taskSet[1].start(1,1))
  .then( -> taskSet[2].start(1,1))
  .then(-> taskSet[3].start(1,1))
  .then(-> Done.start(1,1))

Active_Brain.start = (subject, session) =>
  ## order index
  orderIndex = subject % 4
  tasks = [AST, ArrowFlanker, TrailsB, RAT]
  order = getOrder(orderIndex)[session-1]

  window.taskSet = for ind in order
    tasks[ind-1]

  #window.taskSet = _.shuffle([AST, ArrowFlanker, TrailsB, RAT])
  getSession()
  .then( (session) ->
    window._session = Number(session.data.ID)
    getSubject())
  .then( (subject ) ->
    window._subject = subject.data.ID
    Start.start(window._session, window._subject)
    .then( -> taskSet[0].start(window._session, window._subject))
    .then( -> taskSet[1].start(window._session, window._subject))
    .then(-> taskSet[2].start(window._session, window._subject))
    .then(-> taskSet[3].start(window._session, window._subject))
    .then(-> Done.start.start(window._session, window._subject)))






