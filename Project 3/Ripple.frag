#version 330 compatibility
// you can set these uniform variables  dynamically or hardwire them:
uniform float uKa, uKd, uKs; // coefficients of each type of lighting
uniform float uShininess; // specular exponent

uniform float uNoiseAmp, uNoiseFreq;

uniform sampler2D Noise2;
uniform sampler3D Noise3;

uniform float uLightX, uLightY, uLightZ;
uniform vec4 uColor, uSpecularColor;

// in variables from the vertex shader:
in vec2 vST; // texture cords
in vec3 vN; // normal vector
in vec3 vL; // vector from point to light
in vec3 vE; // vector from point to eye
in vec3 vMCposition;

vec3 newColor = vec3(1., 1., 1.);

vec3
RotateNormal( float angx, float angy, vec3 n )
{
		float cx = cos( angx );
		float sx = sin( angx );
		float cy = cos( angy );
		float sy = sin( angy );

		// rotate about x:
		float yp =  n.y*cx - n.z*sx;    // y'
		n.z      =  n.y*sx + n.z*cx;    // z'
		n.y      =  yp;
		// n.x      =  n.x;

		// rotate about y:
		float xp =  n.x*cy + n.z*sy;    // x'
		n.z      = -n.x*sy + n.z*cy;    // z'
		n.x      =  xp;
		// n.y      =  n.y;

		// newColor = vec3(0., 0., 9.);

		return normalize( n );
}


void
main( )
{
	vec3 Normal = normalize(vN);
	vec3 Light = normalize(vL);
	vec3 Eye = normalize(vE);

	// bump-mapping
	vec4 nvx = texture( Noise3, uNoiseFreq*vMCposition );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;	// -1. to +1.
	angx *= uNoiseAmp;

    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMCposition.xy,vMCposition.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;	// -1. to +1.
	angy *= uNoiseAmp;

	vec3 n = RotateNormal( angx, angy, vN );
	n = normalize(  gl_NormalMatrix * n  );


	newColor = vec3(1., .7, 0.);
	vec3 newSpecular = vec3(1., 1., 1.); // uSpecular

	// here is the per-fragment lighting:
	vec3 ambient = uKa * newColor;
	float d = 0.;
	float s = 0.;
	if( dot(n,Light) > 0. ) // only do specular if the light can see the point
	{
		d = dot(n,Light);
		vec3 ref = normalize( reflect( -Light, n ) ); // reflection vector
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 diffuse =  uKd * d * newColor;
	vec3 specular = uKs * s * newSpecular;
	vec4 FragColor = vec4( ambient + diffuse + specular, 1. );
	//gl_FragColor = vec4( ambient + diffuse + specular, 1. );

	float LightIntensity = abs( dot( normalize(vec3(uLightX,uLightY,uLightZ) - vMCposition), n ) );
	if( LightIntensity < 0.1 )
		LightIntensity = 0.1;

	gl_FragColor = vec4( LightIntensity*FragColor );

}
