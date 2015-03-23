
_ = Psy._

@TrailsB = {}
## this is a task with a simple design: just one factor consisting of three trials.



instructions = """

          Trail Making Task
          ==========================

          In this task you will make a "trail" connecting circles in a particular order.

          You will see a number circles appear on the screen. Each circle will have a number (1,2,3 ...) or a letter inside.

          Your goal is to make a trail linking all the numbered circles and lettered circles alternating in order between numbers and letters.

          Thus, you will first look for the circle with "1" inside, click it, and then find "A" and click that.

          Next you will click 2 and then "B", and so on until you have connected all the circles.

          To make a path between two circles, simply click the next circle in the path.

          When you select the correct circle, it will turn yellow. When you complete the trail, the final circle will turn red.


          Press any key to continue
          -------------------------

          """


@TrailsB.experiment =
  Define:
    active_brain: true
    resultObject: []

  Routines:
    Prelude:
      Events:
        1:
          Markdown: instructions
          Next:
            AnyKey: ""

    Block:
      Start: ->
        Text:
          position: "center"
          origin: "center"
          content: ["Get Ready!", "Press any key to start"]
        Next:
          AnyKey: ""

    Trial: ->
      context = @context
      Background:
        Blank:
          fill: "gray"
        CanvasBorder:
          stroke: "black"

      Events:
        1:
          FixationCross:
            length: 100
          Timeout:
            duration: 500
        2:
          TrailsB:
            id: "trails_b"
            npoints: 24
            react:
              trail_move: (ev) ->
                resp =
                  RT: ev.RT
                  timeElapsed: ev.timeElapsed
                  index: ev.index
                  task: "TrailsB"
                  trialNumber: context.get("State.trialNumber")
                  blockNumber: context.get("State.blockNumber")
                  node: ev.node_id
                resultObj = context.get("resultObject")
                resultObj.push(resp)
                console.log(resultObj)
          Next:
            ## components can emit "signals" that have an id.
            ## when the user connects the last circle, TrailsA emits "trail_completed"
            ## end trial when we "receive" a signal called "trail_completed"
            Receiver:
              signal: "trail_completed"
      Feedback: ->
        Text:
          content: "Nice Job! Press Any Key to Continue."
          position: "center"
          origin: "center"
        Next:
          AnyKey: ""

    Coda:
      Events:
        1:
          Text:
            position: "center"
            origin: "center"
            content: ["End of Trails Task", "Press any key to continue"]
            fontSize: 32

          Next:
            AnyKey: {}

    Save:
      Action:
        execute: (context) ->
          if context.get("active_brain")
            logdat = context.get("resultObject")
            console.log("saving", logdat)
            $.ajax({
              type: "POST"
              url: "/results"
              data: JSON.stringify(logdat)
              contentType: "application/json"
            })

  Flow: (routines) ->
    1: routines.Prelude
    2: BlockSequence:
      trialList: trials
      start: routines.Block.Start
      trial: routines.Trial
    3: routines.Coda
    4: routines.Save



factorSet =
  trial: [1,2,3,4,5]
  #trial: [1,2]

fnode = Psy.FactorSetNode.build(factorSet)

# create 1 block of trials with 1 complete replications per block.
# so this will create 3 trials.
trials = fnode.trialList(1,1)

@TrailsB.start = (subjectNumber, sessionNumber) =>
  context = new Psy.createContext()
  @pres = new Psy.Presentation(trials, @TrailsB.experiment, context)
  @pres.start()





