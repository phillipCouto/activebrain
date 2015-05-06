


_ = Psy._



@Start = {}



@Start.experiment =


  Routines:
    Prelude:
      Events:
        1:
          Markdown: """
          Welcome!
          ==========================

          You will be performing a series of cognitive tasks.

          Please follow the directions on the screen as you go.

          When you're ready to start, **press any key**

          """

          Next:
            AnyKey: {}

  Flow: (routines) ->
    1: routines.Prelude


@Start.start =  (subjectNumber, sessionNumber) =>
  @context = new Psy.createContext()
  @context.set("active_brain", true)
  pres = new Psy.Presentation({}, window.Start.experiment, context)
  pres.start()


