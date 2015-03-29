_ = Psy._
@Active_Brain = {}

## task namespaces are: AST, ArrowFlanker, TrailsB, RAT


getSession = ->
  $.getJSON( "/session")

getSubject =  ->
  $.getJSON( "/subject")

Active_Brain.teststart = =>
  #window.taskSet = _.shuffle([AST, ArrowFlanker, TrailsB, RAT])
  window.taskSet = [AST, ArrowFlanker, TrailsB, RAT]
  Start.start(1, 1)
  .then( -> taskSet[0].start(1,1))
  .then( -> taskSet[1].start(1,1))
  .then( -> taskSet[2].start(1,1))
  .then(-> taskSet[3].start(1,1))
  .then(-> Done.start(1,1))

Active_Brain.start = =>
  #window.taskSet = [AST, ArrowFlanker, TrailsB, RAT]

  window.taskSet = _.shuffle([AST, ArrowFlanker, TrailsB, RAT])
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






