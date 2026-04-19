// dragontest.js, gap-filling tests for the ChoiceScript engine
// Run: node tests/suite.js tests/qunit.js web/scene.js web/util.js headless.js tests/scenetest.js tests/dragontest.js

module("Fairmath Boundaries");
// %+: floor(v1 + v2*(100-v1)/100), caps at 99 not 100
// %-: calls %+(v1, -v2); ceil(v1 - v2*v1/100), floors at 1 not 0
// Verified against scene.js ~line 4995.

test("fairPlus from zero", function() {
    // 0 + 50*(100-0)/100 = 50
    var result = Scene.operators["%+"]("0", "50");
    doh.is(50, result, "0 %+ 50 = 50");
});

test("fairPlus at ceiling produces 99 not 100", function() {
    // 100 + 50*(100-100)/100 = 100, capped at 99 by source
    var result = Scene.operators["%+"]("100", "50");
    doh.is(99, result, "100 %+ 50 = 99 (hard ceiling is 99)");
});

test("fairMinus from ceiling", function() {
    // passes -50 to fairAdd: 100 - 50*(100/100) = 50, ceil = 50
    var result = Scene.operators["%-"]("100", "50");
    doh.is(50, result, "100 %- 50 = 50");
});

test("fairMinus from zero produces 1 not 0", function() {
    // passes -50 to fairAdd: 0 - 50*(0/100) = 0, ceil = 0, floored at 1
    var result = Scene.operators["%-"]("0", "50");
    doh.is(1, result, "0 %- 50 = 1 (hard floor is 1)");
});

test("fairPlus 100 percent saturates at 99", function() {
    // 50 + 100*(50/100) = 100, capped at 99
    var result = Scene.operators["%+"]("50", "100");
    doh.is(99, result, "50 %+ 100 = 99 (saturates at ceiling)");
});

test("fairMinus 100 percent bottoms at 1", function() {
    // 50 - 100*(50/100) = 0, floored at 1
    var result = Scene.operators["%-"]("50", "100");
    doh.is(1, result, "50 %- 100 = 1 (saturates at floor)");
});

test("fairPlus midrange value", function() {
    // 50 + 20*(50/100) = 60
    var result = Scene.operators["%+"]("50", "20");
    doh.is(60, result, "50 %+ 20 = 60");
});

test("fairMinus midrange value", function() {
    // passes -20 to fairAdd: 80 - 20*(80/100) = 64, ceil = 64
    var result = Scene.operators["%-"]("80", "20");
    doh.is(64, result, "80 %- 20 = 64");
});

test("fairPlus string base throws", function() {
    var scene = new Scene("startup");
    scene.lineNum = 5;
    raises(function() {
        Scene.operators["%+"]("\"hello\"", "20", 5, scene);
    }, null, "string base should throw");
});

test("fairPlus string percent throws", function() {
    var scene = new Scene("startup");
    scene.lineNum = 5;
    raises(function() {
        Scene.operators["%+"]("50", "\"20\"", 5, scene);
    }, null, "string percent should throw");
});

test("fairPlus base over 100 throws non-percentile error", function() {
    var scene = new Scene("startup");
    scene.lineNum = 17;
    raises(function() {
        Scene.operators["%+"]("103", "2", 17, scene);
    }, /Can't fairAdd to non-percentile/, "base > 100 should throw");
});

test("fairMinus base over 100 throws non-percentile error", function() {
    var scene = new Scene("startup");
    scene.lineNum = 17;
    raises(function() {
        Scene.operators["%-"]("103", "2", 17, scene);
    }, /Can't fairAdd to non-percentile/, "base > 100 should throw");
});

test("fairPlus via *set on temp", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp brutality 50
        *set brutality %+20`);
    scene.execute();
    // 50 + 20*(50/100) = 60
    doh.is(60, scene.temps.brutality, "50 %+ 20 via *set = 60");
});

test("fairMinus via *set on temp", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp disdain 80
        *set disdain %-25`);
    scene.execute();
    // 80 - 25*(80/100) = 80-20 = 60, ceil = 60
    doh.is(60, scene.temps.disdain, "80 %- 25 via *set = 60");
});

module("Variable Shadowing");

test("temp shadows stat on read", function() {
    printed = [];
    var scene = new Scene();
    scene.name = "startup";
    scene.loadLines(dedent`
        *create wealth 5000
        *temp wealth
        *set wealth 99
        *print wealth`);
    scene.execute();
    doh.is(5000, scene.stats.wealth, "stat unchanged at 5000");
    doh.is(99, scene.temps.wealth, "temp holds new value 99");
    doh.is("<p>99 </p>", printed.join(""), "printed from temp");
});

test("deleting temp reveals stat", function() {
    printed = [];
    var scene = new Scene();
    scene.name = "startup";
    scene.loadLines(dedent`
        *create wealth 5000
        *temp wealth
        *set wealth 99
        *delete wealth
        *print wealth`);
    scene.execute();
    doh.is(5000, scene.stats.wealth, "stat still 5000");
    doh.is("undefined", typeof scene.temps.wealth, "temp deleted");
    doh.is("<p>5000 </p>", printed.join(""), "printed from stat after temp deleted");
});

test("temp does not modify underlying stat via fairmath", function() {
    var scene = new Scene();
    scene.name = "startup";
    scene.loadLines(dedent`
        *create brutality 50
        *temp brutality 50
        *set brutality %+20`);
    scene.execute();
    doh.is(50, scene.stats.brutality, "stat untouched at 50");
    doh.is(60, scene.temps.brutality, "temp updated to 60");
});

module("Loop Limit");

test("infinite goto loop throws at execution limit", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *label loop
        *goto loop`);
    raises(function() { scene.execute(); }, null, "infinite goto should throw");
});

test("bounded loop completes without error", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp counter 0
        *label loop
        *set counter +1
        *if counter < 5
          *goto loop`);
    scene.execute();
    doh.is(5, scene.temps.counter, "loop completed exactly 5 iterations");
});

module("Comment Suppression");

test("comment produces no output", function() {
    printed = [];
    var scene = new Scene();
    scene.loadLines(dedent`
        *comment This should not appear
        hello`);
    scene.execute();
    doh.is("<p>hello </p>", printed.join(""), "comment not in output");
});

module("Fake Choice Fallthrough");

test("fake_choice falls through to following prose", function() {
    printed = [];
    var text = dedent`
        *fake_choice
          #Roar
            You roar.
          #Hiss
            You hiss.
        All paths converge here.`;
    var scene = new Scene();
    scene.loadLines(text);
    var options;
    scene.renderOptions = function(_groups, _options) {
        options = _options;
        this.paragraph();
    };
    scene.execute();
    scene.standardResolution(options[0]);
    ok(printed.join("").indexOf("All paths converge here") !== -1,
       "fallthrough line printed after fake_choice selection");
});

module("Complex Conditionals");

test("if/else: true branch executes", function() {
    printed = [];
    var scene = new Scene();
    scene.loadLines(dedent`
        *if true
          yes
          *finish
        *else
          no
          *finish`);
    scene.execute();
    doh.is("<p>yes </p>", printed.join(""), "true branch prints yes");
});

test("if/else: false branch executes", function() {
    printed = [];
    var scene = new Scene();
    scene.loadLines(dedent`
        *if false
          yes
          *finish
        *else
          no
          *finish`);
    scene.execute();
    doh.is("<p>no </p>", printed.join(""), "false branch prints no");
});

test("and: both true takes branch", function() {
    printed = [];
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp a true
        *temp b true
        *if a and b
          yes
          *finish
        *else
          no
          *finish`);
    scene.execute();
    doh.is("<p>yes </p>", printed.join(""), "and: both true");
});

test("and: one false skips branch", function() {
    printed = [];
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp a true
        *temp b false
        *if a and b
          yes
          *finish
        *else
          no
          *finish`);
    scene.execute();
    doh.is("<p>no </p>", printed.join(""), "and: one false");
});

test("or: one true takes branch", function() {
    printed = [];
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp a false
        *temp b true
        *if a or b
          yes
          *finish
        *else
          no
          *finish`);
    scene.execute();
    doh.is("<p>yes </p>", printed.join(""), "or: one true");
});

test("not(false) takes branch", function() {
    printed = [];
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp a false
        *if not(a)
          yes
          *finish
        *else
          no
          *finish`);
    scene.execute();
    doh.is("<p>yes </p>", printed.join(""), "not(false) = true");
});

test("stat gate: value > 50 passes", function() {
    printed = [];
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp cunning 60
        *if cunning > 50
          gated
          *finish
        *else
          blocked
          *finish`);
    scene.execute();
    doh.is("<p>gated </p>", printed.join(""), "cunning 60 passes >50 gate");
});

test("stat gate: value > 50 fails", function() {
    printed = [];
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp cunning 40
        *if cunning > 50
          gated
          *finish
        *else
          blocked
          *finish`);
    scene.execute();
    doh.is("<p>blocked </p>", printed.join(""), "cunning 40 fails >50 gate");
});

test("elseif chain: selects correct branch", function() {
    printed = [];
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp brutality 70
        *if brutality < 30
          low
          *finish
        *elseif brutality < 60
          mid
          *finish
        *else
          high
          *finish`);
    scene.execute();
    doh.is("<p>high </p>", printed.join(""), "70 routes to high branch");
});

module("Reuse Behaviour After Selection");

test("hide_reuse removes option after first selection", function() {
    var text = dedent`
        *label start
        *choice
          *hide_reuse #Pick me once.
            Done once.
            *goto start
          #Always here.
            *finish`;
    var scene = new Scene();
    scene.loadLines(text);
    var options;
    scene.renderOptions = function(_groups, _options) {
        options = _options;
        this.paragraph();
    };
    scene.execute();
    var countBefore = options.length;
    scene.standardResolution(options[0]);
    ok(options.length < countBefore,
       "hide_reuse option removed after selection (count decreased)");
});

test("disable_reuse marks option unselectable after first selection", function() {
    var text = dedent`
        *label start
        *choice
          *disable_reuse #Pick me once.
            Done once.
            *goto start
          #Always here.
            *finish`;
    var scene = new Scene();
    scene.loadLines(text);
    var options;
    scene.renderOptions = function(_groups, _options) {
        options = _options;
        this.paragraph();
    };
    scene.execute();
    scene.standardResolution(options[0]);
    var disabledOption = options.filter(function(o) {
        return o.name === "Pick me once.";
    })[0];
    ok(disabledOption && disabledOption.unselectable,
       "disable_reuse option is unselectable after first selection");
});

module("Error Paths");

test("referencing undefined variable throws", function() {
    var scene = new Scene();
    scene.loadLines("*set nonexistent 5");
    raises(function() { scene.execute(); }, null, "undefined variable throws");
});

test("*create outside startup throws", function() {
    var scene = new Scene();
    // default name is not "startup", so *create is illegal
    scene.loadLines("*create foo 0");
    raises(function() { scene.execute(); }, null, "*create outside startup throws");
});

test("goto nonexistent label throws", function() {
    var scene = new Scene();
    scene.loadLines("*goto nowhere_defined");
    raises(function() { scene.execute(); }, null, "goto missing label throws");
});

test("no selectable options throws", function() {
    var text = dedent`
        *choice
          *selectable_if (false) #Hidden A
            never A
          *selectable_if (false) #Hidden B
            never B
        baz`;
    var scene = new Scene();
    scene.loadLines(text);
    doh.assertError(Error, scene, "parseOptions", [0, []], "all options unselectable throws");
});

module("Concatenation Operator");

test("concatenate two bare strings", function() {
    // The & operator is [v1,v2].join("") — args are bare values, not quoted tokens
    var result = Scene.operators["&"]("hello", " world");
    doh.is("hello world", result, "& concatenates strings");
});

test("concatenate number and string", function() {
    var result = Scene.operators["&"]("6", "px");
    doh.is("6px", result, "& coerces number to string via join");
});

test("concatenate via *set in scene", function() {
    printed = [];
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp prefix "dragon"
        *temp suffix "fire"
        *temp full ""
        *set full prefix&suffix
        *print full`);
    scene.execute();
    doh.is("<p>dragonfire </p>", printed.join(""), "& via *set joins strings");
});

module("Stat Arithmetic Type Safety");

test("plain + on integer stat", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp wealth 5000
        *set wealth +600`);
    scene.execute();
    doh.is(5600, scene.temps.wealth, "wealth +600 = 5600");
});

test("plain - on integer stat", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp wounds 2
        *set wounds -1`);
    scene.execute();
    doh.is(1, scene.temps.wounds, "wounds -1 = 1");
});

test("fairmath on opposed pair stays within 1-99", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp infamy 90
        *set infamy %+50`);
    scene.execute();
    // 90 + 50*(10/100) = 90+5 = 95, < 99 so no cap
    doh.is(95, scene.temps.infamy, "infamy 90 %+ 50 = 95");
    ok(scene.temps.infamy <= 99, "result does not exceed 99");
});

module("Variable Interpolation");

test("interpolate stat in prose", function() {
    printed = [];
    var scene = new Scene();
    scene.name = "startup";
    scene.loadLines(dedent`
        *create playername "Vermithrax"
        Your name is \${playername}.`);
    scene.execute();
    ok(printed.join("").indexOf("Vermithrax") !== -1, "stat interpolated in prose");
});

test("interpolate temp in prose", function() {
    printed = [];
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp title "the Magnificent"
        You are \${title}.`);
    scene.execute();
    ok(printed.join("").indexOf("the Magnificent") !== -1, "temp interpolated in prose");
});

module("Expression Functions — Math");

test("floor()", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp x floor(3.9)`);
    scene.execute();
    doh.is(3, scene.temps.x, "floor(3.9) = 3");
});

test("ceil()", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp x ceil(3.1)`);
    scene.execute();
    doh.is(4, scene.temps.x, "ceil(3.1) = 4");
});

test("abs() positive", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp x abs(7)`);
    scene.execute();
    doh.is(7, scene.temps.x, "abs(7) = 7");
});

test("abs() negative literal", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp x abs(-5)`);
    scene.execute();
    doh.is(5, scene.temps.x, "abs(-5) = 5");
});

test("unary minus on literal", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp x -7`);
    scene.execute();
    doh.is(-7, scene.temps.x, "*temp x -7 = -7");
});

test("unary minus on variable", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp a 4
        *temp x -a`);
    scene.execute();
    doh.is(-4, scene.temps.x, "*temp x -a negates variable");
});

test("addition with unary minus operand", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp x 10 + -3`);
    scene.execute();
    doh.is(7, scene.temps.x, "10 + -3 = 7");
});

test("min(a,b)", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp x min(10, 3)`);
    scene.execute();
    doh.is(3, scene.temps.x, "min(10, 3) = 3");
});

test("max(a,b)", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp x max(10, 3)`);
    scene.execute();
    doh.is(10, scene.temps.x, "max(10, 3) = 10");
});

module("Expression Functions — String");

test("lowercase()", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp x lowercase("DRAGON")`);
    scene.execute();
    doh.is("dragon", scene.temps.x, "lowercase converts to lower case");
});

test("uppercase()", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp x uppercase("dragon")`);
    scene.execute();
    doh.is("DRAGON", scene.temps.x, "uppercase converts to upper case");
});

module("*push and *pop");

test("push appends to array", function() {
    var scene = new Scene();
    scene.name = "startup";
    scene.loadLines(dedent`
        *create loot_count 0
        *push loot "gold coin"
        *push loot "silver cup"`);
    scene.execute();
    doh.is(2, scene.stats.loot_count, "count is 2 after two pushes");
    doh.is("gold coin", scene.stats.loot_1, "first element correct");
    doh.is("silver cup", scene.stats.loot_2, "second element correct");
});

test("pop retrieves last element", function() {
    var scene = new Scene();
    scene.name = "startup";
    scene.loadLines(dedent`
        *create stack_count 0
        *push stack 10
        *push stack 20
        *temp top 0
        *pop stack top`);
    scene.execute();
    doh.is(20, scene.temps.top, "popped value is last pushed");
    doh.is(1, scene.stats.stack_count, "count decremented after pop");
});

test("pop on empty array throws", function() {
    var scene = new Scene();
    scene.name = "startup";
    scene.loadLines(dedent`
        *create empty_count 0
        *temp discard 0
        *pop empty discard`);
    raises(function() { scene.execute(); }, null, "pop on empty array should throw");
});

module("*for / *next Loop");

test("for loop iterates correct number of times", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp total 0
        *for i from 1 to 5
        *set total +1
        *next i`);
    scene.execute();
    doh.is(5, scene.temps.total, "loop body executed 5 times");
});

test("for loop variable has correct final value", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *for i from 1 to 4
        *next i`);
    scene.execute();
    // after loop, i should equal 4 (last value that satisfied i <= max)
    doh.is(4, scene.temps.i, "loop variable equals max after completion");
});

test("for loop with step 2", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp total 0
        *for i from 0 to 8 step 2
        *set total +1
        *next i`);
    scene.execute();
    doh.is(5, scene.temps.total, "step-2 loop: 0,2,4,6,8 = 5 iterations");
});

test("for loop body skipped when min > max", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp ran false
        *for i from 10 to 5
        *set ran true
        *next i`);
    scene.execute();
    doh.is(false, scene.temps.ran, "body never executes when min > max");
});

test("for loop throws at iteration limit", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *for i from 1 to 999999
        *next i`);
    raises(function() { scene.execute(); }, null, "runaway for loop should throw");
});

module("*switch / *case / *endswitch");

test("switch matches correct case", function() {
    printed = [];
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp rank 2
        *switch rank
        *case 1
        first
        *finish
        *case 2
        second
        *finish
        *default
        other
        *finish
        *endswitch`);
    scene.execute();
    doh.is("<p>second </p>", printed.join(""), "rank 2 routes to second branch");
});

test("switch falls through to default when no case matches", function() {
    printed = [];
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp rank 99
        *switch rank
        *case 1
        first
        *finish
        *default
        other
        *finish
        *endswitch`);
    scene.execute();
    doh.is("<p>other </p>", printed.join(""), "unmatched switch routes to default");
});

test("switch with no match and no default skips block", function() {
    printed = [];
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp rank 99
        *switch rank
        *case 1
        first
        *finish
        *endswitch
        after`);
    scene.execute();
    ok(printed.join("").indexOf("after") !== -1, "execution continues after endswitch when no case matched");
    ok(printed.join("").indexOf("first") === -1, "first branch not printed");
});

module("*return value");

test("gosub can return a value via temps.choice_return", function() {
    var scene = new Scene();
    scene.loadLines(dedent`
        *temp result 0
        *gosub double 21
        *set result choice_return
        *finish
        *label double
        *temp n 0
        *params n
        *return n*2`);
    scene.execute();
    doh.is(42, scene.temps.result, "gosub returned 42 (21*2)");
});
