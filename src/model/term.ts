/**
 * One line of a state's price.
 * Dollars per gallon = constant + oil × Gulf barrel + diesel × diesel price.
 * A tax that is a fixed number of cents has oil = 0 and diesel = 0.
 * The state's price is the sum of its lines.
 */
export type Term = {
  label: string;
  constant: number;
  oil: number;
  diesel: number;
};

export function flat(label: string, dollars: number): Term {
  return { label, constant: dollars, oil: 0, diesel: 0 };
}

export function sumTerms(terms: readonly Term[], label = ""): Term {
  return terms.reduce(
    (total, term) => ({
      label,
      constant: total.constant + term.constant,
      oil: total.oil + term.oil,
      diesel: total.diesel + term.diesel,
    }),
    { label, constant: 0, oil: 0, diesel: 0 },
  );
}

export function scaleTerm(term: Term, factor: number, label: string): Term {
  return {
    label,
    constant: term.constant * factor,
    oil: term.oil * factor,
    diesel: term.diesel * factor,
  };
}

export function priceTerm(term: Term, gulfBarrel: number, dieselPerGallon: number): number {
  return term.constant + term.oil * gulfBarrel + term.diesel * dieselPerGallon;
}
