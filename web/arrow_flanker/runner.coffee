


_ = Psy._

###

  Task:
    name: "arrow_flanker"

    Conditions:
      Crossed:
          flanker:
            levels: ["congruent", "incongruent"]
          centerArrow:
            levels: ["left", "right"]
      Uncrossed:
          flankerArrow:
            levels: ["left", "right"]
            choose: (trial) -> ...
    Items:
      flankerArrow:


###



@ArrowFlanker = {}


@ArrowFlanker.experiment =


  Routines:
    Prelude:
      Events:
        1:
          Markdown: """

          Flanker Task
          ==========================

          On every trial a central arrow will appear surrounded by arrows on either side.
          Your goal is to **focus on the central arrow** and decide whether it points left or right.

            * If the central arrow points <-- left, press the **'g'** key.

            * If the central arrow points --> right, press the **'h'** key.

            * If your response is correct, the screen will briefly turn green.

            * If your response is incorrect, the screen will briefly turn red.


          Answer as quickly and accurately as possible.

          **Press any key to continue**


          """
          Next:
            AnyKey: {}

    Block:
      Start: ->
        Text:
          position: "center"
          origin: "center"
          content: ["Get Ready for Block #{@context.get("State.blockNumber")}!", "Press any key to start"]

        Next: AnyKey: {}

      End: ->
        Text:
          position: "center"
          origin: "center"
          content: ["End of Block #{@context.get("State.blockNumber")}", "Press any key to continue"]

        Next: AnyKey: {}

    Trial: ->
      arrowLen = 150
      arrowx = [@screen.center.x - 2*arrowLen - 20,
                @screen.center.x - arrowLen - 10,
                @screen.center.x,
                @screen.center.x + arrowLen + 10,
                @screen.center.x + 2*arrowLen + 20]

      Background:
        Blank:
          fill: "white"
        CanvasBorder:
          stroke: "black"


      Events:
        1:
          FixationCross:
            fill: "gray"
          Next:
            Timeout:
              duration: 1000
        2:
          Group:
            elements:
              for x, index in arrowx
                Arrow:
                  x: x
                  y: @screen.center.y
                  thickness: 35
                  arrowSize: 75
                  origin: "center"
                  fill: "black"
                  length: arrowLen
                  direction: if index is 2 then @trial.centerArrow else @trial.flankerArrow

          Next:
            KeyPress:
              id: "answer"
              keys: ['g', 'h']
              correct: if @trial.centerArrow is "left" then 'g' else 'h'
              timeout: 1500

      Feedback: ->

        #why does last event have three responses?
        resp = @response[@response.length-1]
        # the above should not be necessary?? response[1] should be sufficient, what gives?
        console.log("feedback resp", @response)

        Blank:
          fill: if resp.accuracy then "green" else "red"
          opacity: .1
        Next:
          Timeout:
            duration: 200

    Coda:
      Events:
        1:
          Action:
            execute: (context) ->
              dat = context.userData({type: "response", name: "KeyPress"}).get()
              console.log("dat:", dat)
              logdat = for obj in dat
                BlockNumber: obj.blockNumber
                RT: obj.RT
                TrialNumber: obj.trialNumber
                KeyChar: obj.keyChar
                NonResponse: obj.nonResponse
                Correct: obj.accuracy
                CenterArrow: obj.trial.centerArrow
                Flanker: obj.trial.flanker
                FlankerArrow: obj.trial.flankerArrow
                Task: "Flanker"

              context.set("resultObject", logdat)
        2:
          Text:
            position: "center"
            origin: "center"
            content: ["End of Flanker Task", "Press Any Key to Continue"]
            fontSize: 28

          Next:
            AnyKey: {}

    Save: ->
      Action:
        execute: (context) ->
          if context.get("active_brain")
            logdat = context.get("resultObject")
            console.log("sending data", logdat)
            $.ajax({
              type: "POST"
              url: "/results"
              data: JSON.stringify(logdat)
              contentType: "application/json"
            })
      Next:
        Timeout: duration: 200


  Flow: (routines) ->
    1: routines.Prelude
    2: BlockSequence:
      trialList: trials
      start: routines.Block.Start
      trial: routines.Trial
      end: routines.Block.End
    3: routines.Coda
    4: routines.Save


factorSet =
  flanker:
    levels: ["congruent", "incongruent"]
  centerArrow:
    levels: ["left", "right"]


fnode = Psy.FactorSetNode.build(factorSet)

# create 4 blocks of trials with 4 complete replications per block
trials = fnode.trialList(4, 4)


trials = trials.bind (record) ->
  flankerArrow: Psy.match record.flanker,
    congruent: record.centerArrow
    incongruent: -> Psy.match record.centerArrow,
      left: "right"
      right: "left"


trials.shuffle()

@ArrowFlanker.start =  (subjectNumber, sessionNumber) =>
  @context = new Psy.createContext()
  @context.set("active_brain", true)
  pres = new Psy.Presentation(trials, window.ArrowFlanker.experiment, context)
  pres.start()


