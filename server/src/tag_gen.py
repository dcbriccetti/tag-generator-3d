from os import system

from flask import Flask, request, render_template, send_file, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/generate_tags', methods=['POST'])
def generate_tags():
    # Parse the incoming JSON data
    data = request.get_json()
    body = data.get('body')
    if not body or not all(item in body for item in 'names tagDims bedWidth'.split()):
        return 'Invalid input', 400

    print(data)
    names: list[str] = [name.strip() for name in body['names'] if name.strip()]
    dims: list[int] = body['tagDims']

    # Generate the SCAD file
    num_cols: int = body['bedWidth'] // dims[0]
    scad_code: str = render_template('tags.scad', names=names, dims=dims, num_cols=num_cols)
    with open('/tmp/tags.scad', 'w') as f:
        f.write(scad_code)

    # Generate the STL file
    system('openscad -o /tmp/tags.stl /tmp/tags.scad')

    # Send the STL file as a response
    response: Response = send_file('/tmp/tags.stl', as_attachment=True, mimetype='application/octet-stream')
    response.headers['Content-Disposition'] = 'attachment; filename=tags.stl'
    return response


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
