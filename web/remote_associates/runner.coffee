



@RAT = {}

@RAT.experiment =

  Define:
    active_brain: true
    resultObject: []

  Routines:
    Prelude:
      Events:
        1:
          Markdown:
            url: "./design/RAT_instructions_page1.md"
          Next: AnyKey: {}
        2:
          Markdown:
            url: "./design/RAT_instructions_page2.md"
          Next: AnyKey: {}
        3:
          Markdown:
            url: "./design/RAT_instructions_page3.md"
          Next: AnyKey: {}

    Coda:
      Events:
        1:
          Text:
            content: "End of Remote Associates Task!"
            position: "center"
            origin: "center"
          Next:
            Timeout:
              duration: 1000

    Part1:

      Start:
        Text:
          content: "Press any key to start"
          position: "center"
          origin: "center"
        Next:
          AnyKey: {}

      End:
        Text:
          content: ["End of Part 1",  "Press any key to continue."]
          position: "center"
          fontSize: 20
          origin: "center"
        Next:
          AnyKey: {}


      Trial: ->
        console.log(@screen)
        Group:
          1:
            Question:
              x: @screen.center.x
              y: @screen.center.y
              headerSize: "small"
              #position: "center"
              origin: "center"
              width: "66%"
              question: @trial.ProblemStim.toUpperCase()
              id: "question"
              type: "multichoice"
              choices: [@trial.AnswerStim1, @trial.AnswerStim2, @trial.AnswerStim3]
              react:
                change: (el) =>
                  #console.log("el", el)
                  @context.set("choice", el)
                  #console.log("choice is", @context.get("choice"))
                  $("#nextbutton").removeClass("disabled")

          2:
            HtmlButton:
              id: "nextbutton"
              origin: "center"
              disabled: true
              label: "Next"
              x: "18.5%"
              y: "42%"
        Next:
          Receiver:
            id: "nextbutton"
            signal: "clicked"

        Feedback: ->
          correct =  @context.get("choice") is @trial.solution
          resp =
            answer: @context.get("choice")
            correct: correct
            condition: "Recognition"
            solution: @trial.solution
            trialNumber: @context.get("State.trialNumber")
            blockNumber: @context.get("State.blockNumber")
            question: @trial.ProblemStim.toUpperCase()

          resultObj = @context.get("resultObject")
          resultObj.push(resp)
          console.log(resultObj)

          Events:
            1:
              Text:
                content: if correct then "Correct!" else "Incorrect."
                origin: "center"
                position: "center"
              Next:
                Timeout: duration: 700
    Part2:
      Start:
        Text:
          content: ["Get ready for Part 2",
                    "You have 60 seconds to answer as many questions as you can",
                    "Type your responses in the empty fields and press enter to submit",
                    "Press any key to begin."]
          origin: "center"
          position: "center"
          fontSize: 28
        Next:
          AnyKey: {}

      End:
        Text:
          content: "End of Part 2. Press any key to continue"
          position: "center"
          origin: "center"
        Next:
          AnyKey: {}

      Trial: ->
        questions = {}
        block = RAT.trialsPart2.getBlock(0)
        context = @context

        console.log("context is", @context)
        console.log("block is", block)
        for record, i in block
          console.log(record)
          questions[(i+1).toString()] =
            Question:
              x: "5%"
              width: "50%"
              headerSize: "small"
              question: record.Stimulus.toUpperCase()
              id: "question" + (i+1)
              type: "textfield"

              react:
                change: (el) ->
                  resultObj = context.get("resultObject")
                  res =
                    questionID: el.id
                    answer: el.val
                    condition: "Generate"
                    question: record.Stimulus.toUpperCase()
                    trialNumber: record.TrialNumber
                    solution: record.solution
                  resultObj.push(res)
                  console.log(resultObj)
                  #$("#nextbutton").removeClass("disabled")
        Group:
          questions
        Next:
          Timeout:
            duration: 60000

        Feedback: ->
          console.log("feedback", @response)

    Save: ->
      Action:
        execute: (context) ->
          if context.get("active_brain")
            logdat= context.get("resultObject")
            $.ajax({
              type: "POST"
              url: "/results"
              data: JSON.stringify(logdat)
              contentType: "application/json"
            })


  Flow: (routines) =>
    1: routines.Prelude
    2: BlockSequence:
        start: routines.Part1.Start
        trialList: @RAT.trialsPart1
        trial: routines.Part1.Trial
        end: routines.Part1.End
    3: BlockSequence:
        start: routines.Part2.Start
        trialList: @RAT.dummyTrials
        trial: routines.Part2.Trial
        end: routines.Part2.End
    4: routines.Coda
    5: routines.Save

@RAT.start = (sessionNumber, subjectNumber) =>
  design_recog = Psy.loadTable("design/RAT_RecList" + sessionNumber + ".txt", separator=",")
  design_gen = Psy.loadTable("design/RAT_GenList" + sessionNumber + ".txt", separator=",")

  @RAT.trialsPart1 = Psy.TrialList.fromBlock(design_recog)
  @RAT.trialsPart2 = Psy.TrialList.fromBlock(design_gen)

  @RAT.dummyTrials = new Psy.TrialList(1)
  @RAT.dummyTrials.add(0, {})


  @RAT.context = Psy.createContext()
  pres = new Psy.Presentation({}, @RAT.experiment, @RAT.context)
  pres.start()