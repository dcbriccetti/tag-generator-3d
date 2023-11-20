// Define constants for dimensions and settings
dims = [50, 15, 1];
text_extrude_height = 0.8;
text_size = dims[1] * 0.55;
text_offset = [dims[0] / 2, dims[1] / 2, dims[2] - text_extrude_height];

spacing_between_tags = dims[1] + 1;

module create_tag(name) {
    difference() {
        cube(dims);
        translate(text_offset) linear_extrude(height = text_extrude_height) {
            text(name, size = text_size, valign = "center", halign = "center");
        }
    }
}

{% for name in names %}
translate([0, {{loop.index0}} * spacing_between_tags, 0]) create_tag("{{ name }}");
{% endfor %}
