#version 330 compatibility

uniform float uBlurRadius;
uniform int kernelSize;

uniform vec2 screenSize;
// uniform sampler2D uTexUnit;

const vec3 WHITE = vec3(1., 1., 1.);
vec3 PURPLE = vec3(0.69, 0.09, 0.92);

void
main( )
{
	//layout(location = 0) out vec3 color;
	// gl_FragColor = vec4(0.1, 0.1, 0.1, 1.);

	// layout(binding=0) uniform sampler2D uTexUnit;
	vec2 texCoord = gl_FragCoord.xy / screenSize;

	gl_FragColor = texture(uTexUnit, texCoord);
}