import http.server

import socketserver

import json

import os

import pandas as pd

import pulp

PORT = 8000

def solve_squad(players, budget, blend_weight, formation):

    

       

                                                 

    df = pd.DataFrame(players)

    

                              

    df['id'] = df['id'].astype(int)

    df['cost'] = df['cost'].astype(float)

    df['points'] = df['points'].astype(float)

    df['form'] = df['form'].astype(float)

    

                                        

    prob = pulp.LpProblem("DoodlePitch_Optimization", pulp.LpMaximize)

    

                                                                                 

    player_vars = {

        row['id']: pulp.LpVariable(f"player_{row['id']}", cat='Binary')

        for _, row in df.iterrows()

    }

    

                                     

                                                                      

                                                                      

    objective_terms = []

    for _, row in df.iterrows():

        p_id = int(row['id'])

        pts = float(row['points'])

        form = float(row['form'])

        score = blend_weight * pts + (1.0 - blend_weight) * (form * 10.0)

        objective_terms.append(player_vars[p_id] * score)

        

    prob += pulp.lpSum(objective_terms)

    

                              

                                                       

    prob += pulp.lpSum(player_vars[row['id']] * float(row['cost']) for _, row in df.iterrows()) <= budget

    

                           

                                    

                                          

    for _, row in df.iterrows():

        p_id = int(row['id'])

        if row.get('locked') is True or row.get('locked') == 1:

            prob += player_vars[p_id] == 1

        elif row.get('excluded') is True or row.get('excluded') == 1:

            prob += player_vars[p_id] == 0

            

                                                      

    if formation == 'squad_11':

                                 

        prob += pulp.lpSum(player_vars[row['id']] for _, row in df.iterrows()) == 11

        prob += pulp.lpSum(player_vars[row['id']] for _, row in df.iterrows() if row['position'] == 'GK') == 1

        prob += pulp.lpSum(player_vars[row['id']] for _, row in df.iterrows() if row['position'] == 'DEF') >= 3

        prob += pulp.lpSum(player_vars[row['id']] for _, row in df.iterrows() if row['position'] == 'DEF') <= 5

        prob += pulp.lpSum(player_vars[row['id']] for _, row in df.iterrows() if row['position'] == 'MID') >= 3

        prob += pulp.lpSum(player_vars[row['id']] for _, row in df.iterrows() if row['position'] == 'MID') <= 5

        prob += pulp.lpSum(player_vars[row['id']] for _, row in df.iterrows() if row['position'] == 'FWD') >= 1

        prob += pulp.lpSum(player_vars[row['id']] for _, row in df.iterrows() if row['position'] == 'FWD') <= 3

        

    elif formation == 'squad_5':

                                                         

        prob += pulp.lpSum(player_vars[row['id']] for _, row in df.iterrows()) == 5

        prob += pulp.lpSum(player_vars[row['id']] for _, row in df.iterrows() if row['position'] == 'GK') == 1

        prob += pulp.lpSum(player_vars[row['id']] for _, row in df.iterrows() if row['position'] == 'DEF') >= 1

        prob += pulp.lpSum(player_vars[row['id']] for _, row in df.iterrows() if row['position'] == 'MID') >= 1

        prob += pulp.lpSum(player_vars[row['id']] for _, row in df.iterrows() if row['position'] == 'FWD') >= 1

        

    else:             

                                               

        prob += pulp.lpSum(player_vars[row['id']] for _, row in df.iterrows()) <= 11

        

                       

    solver = pulp.PULP_CBC_CMD(msg=False)

    status = prob.solve(solver)

    status_str = pulp.LpStatus[status]

    

    if status_str == "Optimal":

        selected_ids = [p_id for p_id, var in player_vars.items() if var.varValue == 1]

        

                                                     

        squad_df = df[df['id'].isin(selected_ids)]

        total_cost = float(squad_df['cost'].sum())

        total_points = float(squad_df['points'].sum())

        avg_form = float(squad_df['form'].mean()) if len(squad_df) > 0 else 0.0

        

        return {

            "status": "optimal",

            "selected_ids": selected_ids,

            "metrics": {

                "total_cost": round(total_cost, 2),

                "total_points": round(total_points, 1),

                "avg_form": round(avg_form, 2),

                "count": len(selected_ids)

            }

        }

    else:

        return {

            "status": status_str.lower(),

            "selected_ids": [],

            "error": f"The solver could not find an optimal solution ({status_str}). Try raising the budget, unlocking some players, or changing formation."

        }

class DoodlePitchHandler(http.server.SimpleHTTPRequestHandler):

    

       

    def __init__(self, *args, **kwargs):

                                                                        

        public_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'public')

        if not os.path.exists(public_dir):

            os.makedirs(public_dir)

        super().__init__(*args, directory=public_dir, **kwargs)

    def do_POST(self):

        if self.path == '/api/solve':

            content_length = int(self.headers['Content-Length'])

            post_data = self.rfile.read(content_length)

            

            try:

                data = json.loads(post_data.decode('utf-8'))

                players = data.get('players', [])

                budget = float(data.get('budget', 100.0))

                weight = float(data.get('weight', 50.0))

                formation = data.get('formation', 'knapsack')

                

                result = solve_squad(players, budget, weight, formation)

                

                self.send_response(200)

                self.send_header('Content-Type', 'application/json')

                                                   

                self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')

                self.end_headers()

                self.wfile.write(json.dumps(result).encode('utf-8'))

                

            except Exception as e:

                import traceback

                traceback.print_exc()

                self.send_response(500)

                self.send_header('Content-Type', 'application/json')

                self.end_headers()

                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))

        else:

            self.send_response(404)

            self.end_headers()

def run(server_class=http.server.HTTPServer, handler_class=DoodlePitchHandler):

    server_address = ('', PORT)

    httpd = server_class(server_address, handler_class)

    print(f"DoodlePitch local solver server running on port {PORT}...")

    try:

        httpd.serve_forever()

    except KeyboardInterrupt:

        print("\nStopping DoodlePitch server...")

        httpd.server_close()

if __name__ == '__main__':

    run()
