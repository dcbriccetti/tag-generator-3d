from os import system
from flask import Flask, request, render_template, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/generate_tags', methods=['POST'])
def generate_tags():
    # Parse the incoming JSON data
    data = request.get_json()
    names = [name.strip() for name in (data.get('names', [])) if name.strip()]

    # Generate the SCAD file
    scad_code: str = render_template('tags.scad', names=names,
                                     dims=[50, 15, 1], num_rows=12, num_cols=3)
    print(scad_code)
    with open('/tmp/tags.scad', 'w') as f:
        f.write(scad_code)

    # Generate the STL file
    system('openscad -o /tmp/tags.stl /tmp/tags.scad')

    # Send the STL file as a response
    response = send_file('/tmp/tags.stl', as_attachment=True, mimetype='application/octet-stream')
    response.headers['Content-Disposition'] = 'attachment; filename=tags.stl'
    return response


if __name__ == '__main__':
    app.run(debug=True)
