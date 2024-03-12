#version 330 compatibility

uniform float uKa, uKd, uKs; // coefficients of each type of lighting
uniform float uShininess; // specular exponent

in vec2 vST; // texture cords
in vec3 gN; // normal vector
in vec3 gL; // vector from point to light
in vec3 gE; // vector from point to eye
in vec3 vXYZ;

void main( )
{
	vec3 Normal = normalize(gN);
	vec3 Light = normalize(gL);
	vec3 Eye = normalize(gE);
	vec3 myColor = vec3(0.59, 0.53, 0.64);
	vec3 mySpecularColor = vec3( 1.0, 1.0, 1.0 ); // specular highlight color

	vec3 ambient = uKa * myColor;
	float d = 0.;
	float s = 0.;

	if( dot(Normal,Light) > 0. ) // only do specular if the light can see the point
	{
		d = dot(Normal,Light);
		vec3 ref = normalize( reflect( -Light, Normal ) ); // reflection 
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}

	vec3 diffuse = uKd * d * myColor;
	vec3 specular = uKs * s * mySpecularColor;
	gl_FragColor = vec4( ambient + diffuse + specular, 1. );
}