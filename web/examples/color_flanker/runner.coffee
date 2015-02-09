@context = new Psy.createContext()
_ = Psy._



factorSet =
  flanker:
    levels: ["congruent", "incongruent"]
  centerColor:
    levels: ["red", "green", "blue", "yellow"]


@colorSampler = new Psy.ReplacementSampler(["red", "green", "blue", "yellow"])

fnode = Psy.FactorSetNode.build(factorSet)

# create 2 blocks of trials with 2 complete replications per block
@trials = fnode.trialList(1, 1)

# add a column to design called 'num' that contains the odd or even numerals
#@trials = @trials.bind ((record) =>
#  if record.flanker is "congruent"
#    flankerColor: record.centerColor
#  else if record.flanker is "incongruent"
#    flankerColor: switch record.centerColor
#        when "red" then Psy.oneOf(["blue", "yellow"])
#        when "green" then Psy.oneOf(["blue", "yellow"])
#        when "blue" then Psy.oneOf(["red", "green"])
#        when "yellow" then Psy.oneOf(["red", "green"])
#  )

console.log("psy match", )
@trials = @trials.bind (record) ->
  flankerColor: Psy.match record.flanker,
      congruent: record.centerColor
      incongruent: -> Psy.match record.centerColor,
          red: Psy.oneOf ["blue", "yellow"]
          green: Psy.oneOf ["blue", "yellow"]
          blue: Psy.oneOf ["red", "green"]
          yellow: Psy.oneOf ["red", "green"]



@trials.shuffle()


window.display =
  Display:

    Define:
      datalog: []


    Prelude:
      Events:
        1:
          Markdown: """

          Welcome to the Experiment!
          ==========================

          This a simple task.

          On every trial a central square will appear surrounded by two flanking squares.
          Your goal is to focus on the central square and make a judgment about its color.
          You should ignore the color of the flanking squares.

            * If the central square is RED or GREEN, press the 'g' key.

            * If the central square is YELLOW or BLUE press the 'h' key.

            * If your response is correct, the screen will briefly turn green.

            * If your response is incorrect, the screen will brielfy turn red.

          Press any key to continue
          -------------------------

          """
          Next:
            AnyKey: ""

    Block:
      Start: ->
        console.log("START BLOCK")
        Text:
          position: "center"
          origin: "center"
          content: ["Get Ready for Block #{@blockNumber}!", "Press Space Bar to start"]
        Next:
          SpaceKey: ""

      End: ->
        console.log("END BLOCK")
        Text:
          position: "center"
          origin: "center"
          content: ["End of Block #{@blockNumber}", "Press any key to continue"]
        Next:
          AnyKey: ""

    Trial: ->
      diameter = 170

      Background:
        Blank:
          fill: "gray"
        CanvasBorder:
          stroke: "black"

      Events:
        1:
          FixationCross:
            fill: "black"
          Next:
            Timeout:
              duration: 1000
        2:
          Group:
            stims: [
              Rectangle:
                x: @screen.center.x - 200
                y: @screen.center.y
                origin: "center"
                fill: @trial.flankerColor
                width: diameter
                height: diameter
            ,
              Rectangle:
                x: @screen.center.x
                y: @screen.center.y
                origin: "center"
                fill: @trial.centerColor
                width: diameter
                height: diameter
            ,
              Rectangle:
                x: @screen.center.x + 200
                y: @screen.center.y
                origin: "center"
                fill: @trial.flankerColor
                width: diameter
                height: diameter
            ]

          Next:
            KeyPress:
              id: "answer"
              keys: ['g', 'h']
              correct: if @trial.centerColor is "red" or @trial.centerColor is "green" then 'g' else 'h'
              timeout: 1000

      Feedback: ->
        console.log("INSIDE feedback!")
        console.log(@context.trialData())
        console.log(@context.trialData().get())
        console.log(@context.trialData().filter({id: "answer"}).get())

        dlog = @context.get("datalog")
        event = @context.trialData().filter({id: "answer"}).get()[0]
        dlog.push(_.pick(event, ["RT", "accuracy", "trialNumber", "keyChar"]))
        console.log("datalog: ", dlog)


        Text:
          content: if @answer?.accuracy then "C" else "X"
          fontSize: 400
          position: "center"
          origin: "center"
        Next:
          Timeout:
            duration: 200
    Coda:
      Events:
        1:
          Text:
            position: "center"
            origin: "center"
            content: "The End"
            fontSize: 200

          Next:
            Timeout: duration: 5000






pres = new Psy.Presenter(trials, display.Display, context)
pres.start().then( =>
  console.log("DONE!!")

  dat = {
    Header:
      id: 10001
      date: Date()
      task: "flanker"
    Data: pres.context.get("datalog")


  }

  console.log(dat)

  $.ajax({
    type: "POST",
    url: "/results",
    data: JSON.stringify(dat),
    contentType: "application/json"
  })
)