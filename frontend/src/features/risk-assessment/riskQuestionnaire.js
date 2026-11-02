// User-approved UI mappings: 0 = lowest capacity, 3 = highest capacity.
export const riskQuestionnaire = [
  {
    "key": "lossReaction",
    "prompt": "What would you do if your investments fell by 20% in a short period?",
    "answers": [
      {
        "value": 0,
        "label": "Sell all my investments immediately to prevent further losses."
      },
      {
        "value": 1,
        "label": "Sell some investments and move the money to safer assets."
      },
      {
        "value": 2,
        "label": "Hold my investments and wait for the market to recover."
      },
      {
        "value": 3,
        "label": "Stay invested and consider investing more at lower prices."
      }
    ]
  },
  {
    "key": "lossTolerance",
    "prompt": "What percentage of temporary loss in your investment portfolio could you tolerate without feeling compelled to sell?",
    "answers": [
      {
        "value": 0,
        "label": "Less than 5%."
      },
      {
        "value": 1,
        "label": "5%–10%."
      },
      {
        "value": 2,
        "label": "10%–20%."
      },
      {
        "value": 3,
        "label": "More than 20%."
      }
    ]
  },
  {
    "key": "emergencySavings",
    "prompt": "How many months of essential living expenses could your emergency savings cover?",
    "answers": [
      {
        "value": 0,
        "label": "Less than 1 month."
      },
      {
        "value": 1,
        "label": "1–3 months."
      },
      {
        "value": 2,
        "label": "3–6 months."
      },
      {
        "value": 3,
        "label": "More than 6 months."
      }
    ]
  },
  {
    "key": "essentialExpenseDependency",
    "prompt": "How much do you depend on your investments to pay for essential living expenses?",
    "answers": [
      {
        "value": 0,
        "label": "I depend heavily on my investments for essential expenses."
      },
      {
        "value": 1,
        "label": "I depend on them occasionally to cover essential expenses."
      },
      {
        "value": 2,
        "label": "I rarely need to withdraw investments for essential expenses."
      },
      {
        "value": 3,
        "label": "I do not depend on investments for essential expenses."
      }
    ]
  },
  {
    "key": "debtManageability",
    "prompt": "How manageable are your existing loan or debt repayments?",
    "answers": [
      {
        "value": 0,
        "label": "Debt repayments are difficult to manage and create financial stress."
      },
      {
        "value": 1,
        "label": "Repayments are manageable but put significant pressure on my budget."
      },
      {
        "value": 2,
        "label": "Repayments are comfortable and do not significantly affect my savings."
      },
      {
        "value": 3,
        "label": "I have no significant outstanding debt or repayment obligations."
      }
    ]
  },
  {
    "key": "investmentHorizon",
    "prompt": "For how long do you plan to keep most of your investments invested before needing the money?",
    "answers": [
      {
        "value": 0,
        "label": "Less than 1 year."
      },
      {
        "value": 1,
        "label": "1–3 years."
      },
      {
        "value": 2,
        "label": "3–7 years."
      },
      {
        "value": 3,
        "label": "More than 7 years."
      }
    ]
  },
  {
    "key": "investmentExperience",
    "prompt": "How would you describe your experience with investing in financial markets?",
    "answers": [
      {
        "value": 0,
        "label": "I am a beginner and have little or no investment experience."
      },
      {
        "value": 1,
        "label": "I have limited experience and have invested occasionally."
      },
      {
        "value": 2,
        "label": "I have reasonable experience and understand common investment products and market fluctuations."
      },
      {
        "value": 3,
        "label": "I have extensive experience managing investments across different asset classes and market conditions."
      }
    ]
  },
  {
    "key": "investmentObjective",
    "prompt": "What is your primary objective when investing?",
    "answers": [
      {
        "value": 0,
        "label": "Protecting my capital and avoiding losses."
      },
      {
        "value": 1,
        "label": "Generating stable returns with limited risk."
      },
      {
        "value": 2,
        "label": "Building long-term wealth while accepting moderate market fluctuations."
      },
      {
        "value": 3,
        "label": "Maximizing long-term growth while accepting significant market volatility."
      }
    ]
  }
];

export const confirmedPrompts = Object.fromEntries(riskQuestionnaire.map(({ key, prompt }) => [key, prompt]));
