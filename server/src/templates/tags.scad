// Define constants for dimensions and settings
dims = [{{ dims[0] }}, {{ dims[1] }}, {{ dims[2] }}];
num_rows = {{ num_rows }};
num_cols = {{ num_cols }};
text_extrude_height = 0.8;
text_size = dims[1] * 0.55;
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
    translate([{{col}} * h_spacing_between_tags, {{row}} * v_spacing_between_tags, 0]) create_tag("{{ names[i] }}");
{% endfor %}
