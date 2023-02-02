import GLPK from "./glpk.js/dist/index.js";

async function main(sol_id, lp_id) {
    const glpk = await GLPK();

    function solution_summary(res, sol_id) {
        const el = window.document.getElementById(sol_id);

        el.innerHTML = JSON.stringify(res, null, 2);
    };

    const lp = {
        name: 'LP',
        objective: {
            direction: glpk.GLP_MAX,
            name: 'obj',
            vars: [
                { name: 'x1', coef: 0.6 },
                { name: 'x2', coef: 0.5 }
            ]
        },
        subjectTo: [
            {
            name: 'cons1',
                vars: [
                    { name: 'x1', coef: 1.0 },
                    { name: 'x2', coef: 2.0 }
                ],
                bnds: { type: glpk.GLP_UP, ub: 1.0, lb: 0.0 }
            },
            {
                name: 'cons2',
                vars: [
                    { name: 'x1', coef: 3.0 },
                    { name: 'x2', coef: 1.0 }
                ],
                bnds: { type: glpk.GLP_UP, ub: 2.0, lb: 0.0 }
            }
        ]
    };

    const opt = {
        msglev: glpk.GLP_MSG_OFF,
        cb: {
            call: res => solution_summary(res, sol_id),
            each: 1
        }
    };

    glpk.solve(lp, opt)
        .then(res => solution_summary(res, sol_id))
        .catch(err => console.log(err));

    console.log(await glpk.solve(lp, glpk.GLP_MSG_DBG));

    window.document.getElementById(lp_id).innerHTML = await glpk.write(lp);
}
