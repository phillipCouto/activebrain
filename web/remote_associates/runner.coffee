


_ = Psy._


@RAT = {}

@RAT.experiment =

  Define:
    active_brain: true
    resultObject: []
    resultObject2: []

  Routines:
    Prelude1:
      Events:
        1:
          Markdown:
            url: "./design/RAT_instructions_page1.md"
          Next: AnyKey: {}
    Prelude2:
      Events:
        1:
          Markdown:
            url: "./design/RAT_instructions_page2.md"
          Next: AnyKey: {}

    Prelude3:
      Events:
        1:
          Markdown:
            url: "./design/RAT_instructions_page3.md"
          Next: AnyKey: {}

    #Coda:
    #  Events:
    #    1:
    #      Text:
    #        content: "End of Remote Associates Task!"
    #        position: "center"
    #        origin: "center"
    #      Next:
    #        Timeout:
    #          duration: 1000

    Part1:

      Start:
        Text:
          content: "Press any key when you are ready to begin."
          position: "center"
          fontSize: 24
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

      PracticeEnd:
        Text:
          content: ["Solution: *Lawn* mower / *Lawn* gnome / *Lawn* fertilizer",
                    "",
                    "",
                    "Remember to answer as quickly as possible. Press any key to continue"]
          position: "center"
          fontSize: 20
          origin: "center"
        Next:
          AnyKey: {}



      Trial: ->
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
            timeout: 60000

        Feedback: ->
          correct =  @context.get("choice") is @trial.solution
          resp =
            questionID: 0
            answer: @context.get("choice")
            correct: correct
            condition: "Recognition"
            question: @trial.ProblemStim.toUpperCase()
            trialNumber: @context.get("State.trialNumber")
            blockNumber: @context.get("State.blockNumber")
            solution: @trial.solution
            Task: "Remote Associates"

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
          content: ["Get ready for Part 2!",
                    "",
                    "Press any key to begin."]
          origin: "center"
          position: "center"
          fontSize: 24
        Next:
          AnyKey: {}

      End:
        Text:
          content: "End of Remote Associates Task. Press any key to continue"
          position: "center"
          origin: "center"
          fontSize: 20
        Next:
          AnyKey: {}

      PracticeEnd:
        Text:
          content: [
                    "Solution: Fried *Chicken* / *Chicken* Dumpling / *Chicken* Out)",
                    "",
                    "",
                    "Press any key to continue"]
          position: "center"
          fontSize: 20
          origin: "center"
        Next:
          AnyKey: {}


      TrialPractice: ->
        context = @context
        Events:
          1:
            Question:
              x: "5%"
              y: "33%"
              width: "50%"
              headerSize: "small"
              question: @trial.Stimulus.toUpperCase()
              id: "practice_question"
              type: "textfield"
              react:
                change: (el) ->
                  context.set("practiceResponse", el)

            Next:
              Receiver:
                id: "practice_question"
                signal: "change"
                timeout: 10000

        Feedback: ->
          console.log("practiceResponse", context.get("practiceResponse"))
          console.log("response", @response)

      Trial: ->
        questions = {}
        block = RAT.trialsPart2.getBlock(0)
        context = @context

        console.log("context is", @context)
        console.log("block is", block)

        _.forEach(block, (record, i) ->
          console.log(record)
          questions[(i+1).toString()] =
            Question:
              x: "5%"
              width: "50%"
              headerSize: "small"
              question: record.Stimulus.toUpperCase()
              id: "question_" + (i+1)
              type: "textfield"
              focus: if i == 0 then true else false
              react:
                change: (el) ->
                  resultObj = context.get("resultObject2")
                  index = el.id.split("_")[1]
                  res =
                    questionID: el.id
                    answer: el.val
                    condition: "Generate"
                    question: record.Stimulus.toUpperCase()
                    trialNumber: index
                    blockNumber: context.get("State.blockNumber")
                    solution: record.solution
                    Task: "Remote Associates"
                  resultObj[index] = res
                  console.log(resultObj)
                  #$("#nextbutton").removeClass("disabled")
        )
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
            logdat1 = context.get("resultObject")
            logdat2 = context.get("resultObject2")
            logdat = logdat1.concat(logdat2)

            console.log("saving ", logdat)
            $.ajax({
              type: "POST"
              url: "/results"
              data: JSON.stringify(logdat)
              contentType: "application/json"
            })


  Flow: (routines) =>
    1: routines.Prelude1
    2: BlockSequence:
        trialList: @RAT.trialsPractice
        trial: routines.Part1.Trial
        end: routines.Part1.PracticeEnd
    3: BlockSequence:
        start: routines.Part1.Start
        trialList: @RAT.trialsPart1
        trial: routines.Part1.Trial
        end: routines.Part1.End
    4: routines.Prelude2
    5: BlockSequence:
        trialList: @RAT.trialsPractice2
        trial: routines.Part2.TrialPractice
        end: routines.Part2.PracticeEnd
    6: routines.Prelude3
    7: BlockSequence:
        start: routines.Part2.Start
        trialList: @RAT.dummyTrials
        trial: routines.Part2.Trial
        end: routines.Part2.End
    #4: routines.Coda
    8: routines.Save

@RAT.start = (sessionNumber, subjectNumber) =>
  if sessionNumber > 4
    console.log("warning: sessionNumber > 4, resetting to 1")
    sessionNumber = 1

  design_recog = Psy.loadTable("design/RAT_RecList" + sessionNumber + ".txt", ",")
  design_gen = Psy.loadTable("design/RAT_GenList" + sessionNumber + ".txt", ",")
  design_prac = Psy.loadTable("design/RAT_PracList.txt", ",")
  design_prac2 = Psy.loadTable("design/RAT_PracList2.txt", ",")

  @RAT.trialsPractice = Psy.TrialList.fromBlock(design_prac)
  @RAT.trialsPractice2 = Psy.TrialList.fromBlock(design_prac2)
  @RAT.trialsPart1 = Psy.TrialList.fromBlock(design_recog)
  @RAT.trialsPart2 = Psy.TrialList.fromBlock(design_gen)

  @RAT.dummyTrials = new Psy.TrialList(1)
  @RAT.dummyTrials.add(0, {})


  @RAT.context = Psy.createContext()
  pres = new Psy.Presentation({}, @RAT.experiment, @RAT.context)
  pres.start()
