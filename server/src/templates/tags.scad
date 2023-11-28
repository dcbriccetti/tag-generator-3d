// Template inputs: names, dims, num_cols

dims = {{ dims }};
text_extrude_height = dims[2] * 0.65;
text_size = dims[1] * 0.45;
text_offset = [dims[0] / 2, dims[1] / 2, dims[2] - text_extrude_height];
v_spacing_between_tags = dims[1] + 1;
h_spacing_between_tags = dims[0] + 1;

module create_tag(name) {
    difference() {
        cube(dims);
        translate(text_offset) linear_extrude(height = text_extrude_height) {
            text(name, size = text_size, valign = "center", halign = "center");
        }
    }
}

{% for i in range(names|length) %}
    {% set row = i // num_cols %}
    {% set col = i % num_cols %}
    translate([
        {{col}} * h_spacing_between_tags,
        {{row}} * v_spacing_between_tags,
        0]) create_tag("{{ names[i] }}");
{% endfor %}
