


_ = Psy._


@Done = {}


@Done.experiment =


  Routines:
    Prelude:
      Events:
        1:
          Text:
            content: ["You are finished!",
                      "Please raise your hand briefly and await further instructions."]
            fontSize: 20
            position: "center"
            origin: "center"
          Next:
            AnyKey: {}

  Flow: (routines) ->
    1: routines.Prelude


@Done.start =  (subjectNumber, sessionNumber) =>
  @context = new Psy.createContext()
  @context.set("active_brain", true)
  pres = new Psy.Presentation({}, window.Done.experiment, context)
  pres.start()


