exports.functions = [
    {
        "name": "nameOfFunction",
        "func": function (args) {
            return "the function";
        }
    }
];

exports.filters = [
    {
        "name": "reverse",
        "func": function (s) {
            var r = '';
            for (var i = s.length - 1; i >= 0; i--) r += s[i];

            return r;
        }
    }
];

exports.data = {
    "global": {
        "title": "Gulp and Twig title"
    },
    "index": {
        "benefits": [
            "Fast",
            "Flexible",
            "Secure"
        ]
    },
    "blog": {
        "tiles": [
            {
                "title": "title1",
                "desc": "desc1"
            },
            {
                "title": "title2",
                "desc": "desc2"
            }
        ]
    }
};
