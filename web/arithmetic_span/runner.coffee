_ = Psy._
@AST = {}


instructions = """

          Arithmetic Systems Task
          ==========================

          This will be a test of arithmetic skill. You will be solving basic subtraction and multiplication problems.
          Problems will appear on the screen. Solve the problem, and type the answer using the keyboard.
          Then press enter to proceed to the next question.

          Answer as **quickly as possible**.


          Problems will appear in 2 blocks of 28. 1 of subtraction and 1 of multiplication.

          There will be a short practice set so you can get used to answering.

          **Press any key to continue**


          """




@AST.experiment =

  Define:
    task: ""
    active_brain: true

  Routines:

    Prelude:
      Events:
        1:
          Markdown: instructions
          Next:
            AnyKey: ""

    StartPractice: ->
      @context.set("task", "practice")

      Text:
        content: ["You will now receive 6 practice problems.", "Press any key to continue."]
        origin: "center"
        position: "center"
      Next:
        AnyKey: {}


    EndPractice: ->
      Markdown: """

                Good work!
                ==========

                We will now start the test.

                Remember to answer as quickly as you possibly can while getting most correct.

                Type your answer and press ENTER to advance to the next problem.

                There will be no feedback on your performance during the test.

                When you are ready, press any key. """
      Next:
        AnyKey: {}


    Block:
      StartMult: ->
        Events:
          1:
            Action:
              execute: (context) ->
                context.set("task", "real")
          2:
            Text:
              position: "center"
              origin: "center"
              content: ["Get Ready for Multiplication Problems!", "Press any key to start"]
            Next:
              AnyKey: ""
      Start: ->
        Events:
          1:
            Action:
              execute: (context) ->
                context.set("task", "real")
          2:
            Text:
              position: "center"
              origin: "center"
              content: ["Get Ready for Subtraction Problems!", "Press any key to start"]
            Next:
              AnyKey: ""

      End: ->
        console.log(@context.userData({taskName: "main", type: "response", name: "Receiver"}).get())
        Text:
          position: "center"
          origin: "center"
          content: ["End of block", "Press any key to continue"]
        Next:
          AnyKey: ""

    Trial: ->
      problem = @trial.Problem.split(/[\\x=-]/)
      x1 = problem[0]
      x2 = problem[1]
      op = if @trial.Operation is "Multiplication" then "x" else "-"

      Events:
        1:
          FixationCross:
            fill: "gray"
          Next:
            Timeout:
              duration: 500
        2:
          Question:
            #x: @screen.center.x
            #y: @screen.center.y
            position: "center"
            origin: "center"
            width: "33%"
            headerSize: "huge"
            question: x1 + " " + op + " " + x2 + " = " + "?"
            id: "problem" + @trial.ProblemID
            type: "textfield"
            react:
              change: (el) ->
                #$("#nextbutton").removeClass("disabled")
          Next:
            Receiver:
              id: "problem" + @trial.ProblemID
              signal: "change"
              timeout: 6000


      Feedback: ->
        console.log(@response)
        if @context.get("task") is "practice"
          message = if @response[1].event is "timeout"
            "Too Slow"
          else if @response[1].event.val is @response[1].trial.Answer
            "Correct!"
          else
            "Incorrect!"

          if @response[1].RT > 2000
            message += " -- Too slow!"
          Text:
            content: message
            position: "center"
            origin: "center"
          Next:
            Timeout:
              duration: 500

    Coda: ->

      Events:
        1:
          Action:
            execute: (context) ->
              console.log("executing coda")
              dat = context.userData({taskName: "main", type: "response", name: "Receiver"}).get()
              logdat = for obj in dat
                TrialNumber: obj.trialNumber
                BlockNumber: obj.blockNumber
                RT: obj.RT
                Response: obj.event.val
                Answer: obj.trial.Answer
                Operation: obj.trial.Operation
                Correct: obj.event.val == obj.trial.Answer
                ProblemID: obj.trial.ProblemID
                Problem: obj.trial.Problem
                Task: "Arithmetic"
              console.log("logdat", logdat)
              context.set("resultObject", logdat)

        2:
          Text:
            content: "End of Arithmetic Task"
            position: "center"
            origin: "center"
          Next:
            Timeout:
              duration: 1000

    Save: ->
      Action:
        execute: (context) ->
          console.log("executing save action")
          console.log("active_brain", context.get("active_brain"))
          if context.get("active_brain")
            logdat= context.get("resultObject")
            console.log("sending data", logdat)
            $.ajax({
              type: "POST"
              url: "/results"
              data: JSON.stringify(logdat)
              contentType: "application/json"
            })
      Next:
        Timeout: duration: 200


  Flow: (routines) =>
    1: routines.Prelude
    2: BlockSequence:
      name: "practice"
      trialList: @AST.trialsPractice
      start: routines.StartPractice
      trial: routines.Trial
      end: routines.EndPractice
    #3: routines.EndPractice
    3: BlockSequence:
      name: "main"
      trialList: @AST.trialsPart1
      start: routines.Block.Start
      trial: routines.Trial
      end: routines.Block.End
    4: BlockSequence:
      name: "main"
      trialList: @AST.trialsPart2
      start: routines.Block.StartMult
      trial: routines.Trial
      end: routines.Block.End
    5: routines.Coda
    6: routines.Save



@AST.start = (sessionNumber, subjectNumber) =>
  context = new Psy.createContext()

  if subjectNumber?
    context.set("active_brain", true)
    context.set("subjectNumber", subjectNumber)
  else
    subjectNumber = 1
    context.set("subjectNumber", subjectNumber)

  if sessionNumber?
    context.set("sessionNumber", sessionNumber)

  console.log("session Number", context.get("sessionNumber"))
  console.log("subject Number", context.get("subjectNumber"))
  console.log("active_brain", context.get("active_brain"))

  console.log("loading practice")

  design_prac = Psy.loadTable("design/AST_Practice.txt", separator=",")
  console.log("prac:", design_prac)

  design_sub = Psy.loadTable("design/AST_SubList" + sessionNumber + ".txt", separator=",")
  design_mul = Psy.loadTable("design/AST_MulList" + sessionNumber + ".txt", separator=",")


  design_sub = design_sub.shuffle()
  design_mul = design_mul.shuffle()

  #design_both = Psy.DataTable.rbind2(design_sub, design_mul)

  @AST.trialsPart1 = Psy.TrialList.fromBlock(design_sub)
  @AST.trialsPart2 = Psy.TrialList.fromBlock(design_mul)

  @AST.trialsPractice = Psy.TrialList.fromBlock(design_prac)


  @pres = new Psy.Presentation({}, @AST.experiment, context)
  @pres.start()


