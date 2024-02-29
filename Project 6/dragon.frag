#version 330 compatibility

uniform float uKa, uKd, uKs; // coefficients of each type of lighting
uniform float uShininess; // specular exponent
in vec2 vST; // texture cords
in vec3 vN; // normal vector
in vec3 vL; // vector from point to light
in vec3 vE; // vector from point to eye
in vec3 vXYZ;

void main( )
{
	vec3 Normal = normalize(vN);
	vec3 Light = normalize(vL);
	vec3 Eye = normalize(vE);
	vec3 myColor = vec3( 0.2, 0.4, 0.65); // default color
	// vec3 myColor = vec3(1., 1., 1.);
	vec3 mySpecularColor = vec3( 1.0, 1.0, 1.0 ); // specular highlight color


	//if (vXYZ.y >= 12. && abs(vXYZ.x) >= 3.85 || vXYZ.z <= -5. && abs(vXYZ.x) >= 3.)
	if (vXYZ.y <= 14. && abs(vXYZ.x) >= 5. || vXYZ.z <= -5. && abs(vXYZ.x) >= 3.)
	{
		myColor = vec3(0.8, 0.8, 0.8);
	}

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